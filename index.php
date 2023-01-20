<!DOCTYPE html>
<html lang="en">
<head>    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="game-data-json" content="<?php
        require "utilities_php.php";
        require "functions_php.php";
        echo htmlspecialchars( createNewGameUnits( 's') );

        // echo gameDataJson();
    
    ?>">
    <title>Heroes of Strategy and Tactics</title>
    <link rel="stylesheet" href="main.css">  
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>   -->
    <script src="jquery.min.js"></script>  
</head>
<body>
    <div id="container">
        <div id="board"></div>
        <div id="info-panel">
            <div id="turn-info-panel">
                <div id="global-turn-count"></div>
                <div id="current-player-name"></div>
            </div>
            <div id="unit-parameters-panel"></div>
        </div>
    </div>
    <div id="end-turn">End Turn</div>
    <script src="utilities_js.js"></script>
    <!-- <script src="units.js"></script> -->
    <script src="functions_js.js"></script>
    <script src="events.js"></script>
    <script src="initialization.js"></script>    
    <script src="main.js"></script> 
</body>
</html>