<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Games;
use App\Models\Country;
use Illuminate\Support\Facades\View;
use Log;

class GamesController extends Controller
{
    public function __construct()
    {

    }

    public function index()
    {
        return View::make('games.index');
    }

    public function GetCountries()
    {
        $countries = [];
        $country = Country::select('name')
            ->inRandomOrder()
            ->where('name', 'not like', "% %")
            ->limit(10)
            ->get();

        foreach ($country as $k => $v)
        {
            array_push($countries, $v->name);
        }

        return json_encode($countries);
    }

    public function SubmitAnswer(Request $request)
    {
        $game = new Games;
        $game->name     = $request->name;
        $game->quiz     = $request->quiz;
        $game->score    = $request->score;

        $game->save();

        return response()->json(array('success' => true, 'last_insert_id' => $game->id), 200);
    }

}
