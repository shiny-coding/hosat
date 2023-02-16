<!DOCTYPE html>
<html lang="en">
<head>    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="game-data-json" content="<?php
        require "utilities/utilities.php";
        require "functions_php.php";
        echo htmlspecialchars( createNewGameUnits( 's') );    
    ?>">
    <title>Heroes of Strategy and Tactics</title>
    <link rel="stylesheet" href="main.css">  
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>   -->
    <script src="jquery.min.js"></script>  
</head>
<body>
    <div id="container">
        <div id="board"></div>
        <div id="sidebar">
            <div id="round"></div>
            <div id="turn"></div>   
            <div id="current-player"></div>          
            <div id="unitbar">
                <div id="unit-stats"></div>
                <div id="unit-abilities"></div>
                <div id="unit-actions"></div>
                <div id="action-description"></div>
            </div>
            <div id="end">End</div>
        </div>
    </div>    
    <script src="utilities/utilities.js"></script>
    <script src="functions_js.js"></script>
    <script src="events.js"></script>
    <script src="initialization.js"></script>    
    <script src="main.js"></script> 
</body>
</html>