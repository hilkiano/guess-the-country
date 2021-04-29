const Scramble = {};

Scramble.playerName = "";
Scramble.question   = "";
Scramble.answer     = "";

var initial = 61000;
var count = initial;
var counter;
var initialMillis;

$(function() {
    // Modal for new user
    $('#guestModal').modal({
        closable: false,
        blurring: true,
        inverted: true,
        onHide: function() {
            Scramble.StartTimer();
        }
    });

    $('#scoreModal').modal({
        closable: false,
        blurring: true,
        inverted: true
    });

    $('#confirmationModal').modal({
        blurring: true,
        inverted: true,
        onApprove: function(){
            Scramble.StopTimer();
            Scramble.SubmitAnswers(false);
        },
        onDeny: function(){
            $(this).modal('hide');
        }
    });
    
    $('#guestModal').modal('show');

    $('#beginButton').on('click', function() {
        Scramble.BeginGame();
    });

    $('#name').on('keypress', function() {
        $('#nameInput').removeClass("error");
    });

    $('#submitButton').on('click', function() {
        $('#confirmationModal').modal('show');
    });
});

Scramble.StartTimer = function()
{
    clearInterval(counter);
    initialMillis = Date.now();
    counter = setInterval(timer, 1);

    function timer()
    {
        if (count <= 0) {
            clearInterval(counter);
            return;
        }
        let current = Date.now();
        
        count = count - (current - initialMillis);
        initialMillis = current;
        displayCount(count);
    }
    
    function displayCount(count)
    {
        let res = count / 1000;
        if (res < 0.001)
        {
            Scramble.StopTimer();
            Scramble.SubmitAnswers(true);
        }

        $('#stopwatch').html(res.toPrecision(count.toString().length) + " secs");
    }
}

Scramble.StopTimer = function()
{
    clearInterval(counter);
}

Scramble.BeginGame = function() {
    // check name is inserted
    let playerName = $("#name").val();
    if (playerName === "")
    {
        $('#nameInput').addClass("error").transition('shake');
        return false;
    }

    Scramble.playerName = playerName;
    $('#playerName').html(playerName);

    // Getting words
    Scramble.PrepareWords();

    $('#guestModal').modal('hide');
}

Scramble.PrepareWords = function() {
    let lToken = $("#token").val();

    $.when(GetCountries()).then(function (countries){
        let scrambled = [];
        // generate object
        countries.forEach(function(country) {
            scrambled.push(Scramble.Scrambling(country));
        });

        Scramble.question   = scrambled;
        Scramble.answer     = countries;
        
        // finishing up
        Scramble.PrepareHTML();
    });

    function GetCountries ()
    {
        return $.ajax({
            type: 'get',
            url: urlApi.getCountries,
            data: {
                _token: lToken
            },
            dataType: 'json'
        });
    }
}

Scramble.PrepareHTML = function() {
    let number = 1;
    Scramble.question.forEach(function(word) {
        let html = '<div class="row">';
        html += '<div class="column">';
        html += '<h1>'+ number +'. '+ word +'</h1>';
        html += '<div id="element'+ number +'Answer" class="ui fluid input">';
        html += '<input id="answer'+ number +'" name="answer'+ number +'" type="text" placeholder="Your answer...">';
        html += '</div></div></div>';
        $("#quizGrid").append(html);

        number++;
    });

    // add events
    $("[id^=answer]")
        .css("text-transform", "uppercase")
        .on('keyup', function() {
            $(this).val($(this).val().toUpperCase());
        });
}

Scramble.SubmitAnswers = function(zero) {
    let timeLeft = $('#stopwatch').html();
    $('#resultTable').html('');
    let answered = [];
    let lToken = $("#token").val();

    $("#quizGrid input[type=text]").each(function() {
        answered.push(this.value);
    });
    
    let q = 1;
    let correctAnswer = 0;
    let score = 0;
    let rowResult = "";

    for (let i = 0; i < answered.length; i++)
    {
        // prepare html
        rowResult = '<tr><td>'+ q +'</td>';
        rowResult += '<td>'+ Scramble.question[i] +'</td>';

        // total score from correct answer
        if (answered[i] === Scramble.answer[i])
        {
            correctAnswer++;
            score += 10;
            rowResult += '<td><i class="green check icon"></i> '+ answered[i] +'</td>';
        }
        else
        {
            rowResult += '<td><i class="red times icon"></i> '+ answered[i] +'</td>';
        }
        rowResult += '<td class="green">'+ Scramble.answer[i] +'</td>';
        $('#resultTable').append(rowResult);

        q++;
    }

    // multiply with time left
    let milliSecs = timeLeft.match(/\d/g);
    milliSecs = milliSecs.join("");
    if (!zero)
    {
        score = score * milliSecs;
    }

    // create json string about question, answered, and right answer. Save to database
    let playerName = Scramble.playerName;
    let results = {
        "question"  : Scramble.question,
        "answers"   : Scramble.answer,
        "answered"  : answered
    };

    // display score
    let message = "";
    if (zero)
    {
        message = 'Time\'s up! You answered '+ correctAnswer +' from 10 questions correctly.'; 
    }
    else
    {
        message = 'You answered '+ correctAnswer +' from 10 questions correctly in '+ timeLeft +'.'; 
    }
    $('#message').html(message);
    $('#scoreCont').html(score);
    $('#scoreModal').modal('show');

    // prepare saving
    let ajaxData = {
        "_token": lToken,
        "name": playerName,
        "quiz": JSON.stringify(results),
        "score": score
    }

    $.when(AjaxAddResults(ajaxData)).then(function(response) {
        // code here
    });

    function AjaxAddResults (ajaxData)
    {
        return $.ajax({
            type: 'post',
            url: urlApi.submitAnswer,
            data: ajaxData,
            dataType: 'json'
        });
    }
}

Scramble.Scrambling = function(word) {
    let a = word.split(""),
        n = a.length;

    for (let i = n - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}