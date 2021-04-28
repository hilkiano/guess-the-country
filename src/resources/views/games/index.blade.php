<!DOCTYPE html>
<html>
    <head>
        <link href="{{ asset('semantic.min.css') }}" rel="stylesheet">
        <link href="{{ asset('main.css') }}" rel="stylesheet">
        <title>Guess The Country</title>
        <script>
            const urlApi = {
                submitAnswer    : "{{ route('submit.answer') }}",
                getCountries    : "{{ route('get.countries') }}"
            };
        </script>
    </head>
    <body>
        <div class="ui inverted vertical masthead center aligned segment">
            <div class="ui text container">
                <div class="row">
                    <div class="column">
                        <h2 class="ui inverted icon header">
                        <i class="world icon"></i>
                        <div class="content">
                            Guess The Country
                            <div class="sub header">Guess the country correctly within time limit.</div>
                        </div>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
        <div id="mainGrid" class="ui vertical segment">
            <div class="ui container grid">
                <div class="row">
                    <div class="column">
                        <div class="ui vertical segment">
                            <h4 class="ui left floated header">
                                <i class="user circle icon"></i>
                                <div id="playerName" class="content"></div>
                            </h4>
                            <h4 class="ui right floated header">
                                <i class="stopwatch icon"></i>
                                <div id="stopwatch" class="content"></div>
                            </h4>  
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="column">
                    <div class="ui segments">
                        <div class="ui segment">
                            <div id="quizGrid" class="ui grid container">
                            </div>
                        </div>
                        <div class="ui secondary segment">
                            <div id="submitButton" class="ui primary button">Submit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>

    <!-- MODAL -->
    <div id="guestModal" class="ui small modal">
        <div class="header">
            Enter your name
        </div>
        <div class="content">
            <div class="ui small header">Welcome to Guess The Country. Before playing, please enter your desired name. Timer will automatically start after you click START button. Happy guessing.</div>
            <input id="token" type="hidden" value="{{ csrf_token() }}">
            <div id="nameInput" class="ui fluid input">
                <input id="name" name="name" type="text" placeholder="Your name..." maxlength="100">
            </div>
        </div>
        <div class="actions">
            <div id="beginButton" class="ui green button">Start</div>
        </div>
    </div>

    <div id="confirmationModal" class="ui tiny modal">
        <div class="header">
            Finish already?
        </div>
        <div class="content">
            You still have time to check your answers. Submit now?
        </div>
        <div class="actions">
            <div id="noButton" class="ui cancel button">Not yet</div>
            <div id="yesButton" class="ui ok green button">Yes</div>
        </div>
    </div>

    <div id="scoreModal" class="ui small modal">
        <div class="header">
            Results
        </div>
        <div class="content">
            <h3 class="ui header"><div id="message"></div></h3>
            <table class="ui celled table">
                <thead>
                <tr><th>No</th>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                </tr></thead>
                <tbody id="resultTable">
                </tbody>
            </table>
            <div class="ui vertical center aligned segment">
                <div class="ui huge statistic">
                    <div class="label">Score</div>
                    <div id="scoreCont" class="value"></div>
                </div>
            </div>
        </div>
        <div class="actions">
            <div onclick="location.reload();" class="ui green button">Retry</div>
        </div>
    </div>
</html>

<script type="text/javascript" src="{{ asset('jquery-3.6.0.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('semantic.min.js') }}"></script>
<script type="text/javascript" src="{{ asset('main.js') }}"></script>