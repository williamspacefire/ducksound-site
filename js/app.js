/**
 * Created by williamspacefire on 1/10/17.
 */
var angular = angular.module("ducksound", ['ngMaterial']);
angular.controller('ctrl', function ($scope, $http, $mdDialog, $location) {
    var base_url = "https://ducksound.tk/";
    var email = "contact@ducksound.tk";
    $scope.client_id = "da2849d8ad5fea67366e4da7444f0152";
    $scope.object = [];

    $scope.progress = false;
    $scope.result = [];

    var form;

    function search(query) {
        $scope.result = [];
        $scope.progress = true;
        $http.get('https://api.soundcloud.com/tracks?client_id='+$scope.client_id+'&q='+query+'&limit=70').then(function (response) {
            $scope.progress = false;

            for(var i = 0;i < response.data.length;i++){
                var aux, min, sec;
                aux = response.data[i].duration / 1000;
                min = parseInt(aux / 60);
                sec = parseInt(aux % 60);
                if((sec+"").length == 1){
                    sec = "0"+sec;
                }

                response.data[i].duration = min+":"+sec;
            }

            $scope.result = response["data"];
        });
    }
    
    setTimeout(function () {
        var form = document.getElementById("searchForm");
        document.getElementById("query").focus();
        form.addEventListener("submit", function (e) {
            var query = document.getElementById("query");
            if(query.value.length > 0){
                search(query.value);
            }
            return false;
        });
    }, 1000);

    search("");

    $scope.query = function (q) {
        search(q);
    };

    var current_playing = null,
        playing = false,
        music_player = null;
    $scope.play = function (music) {
        var player = document.getElementById("player");
        var music_url = music.stream_url+"?client_id="+$scope.client_id;
        var playbtn = document.getElementById("playbtn-"+music.id);

        if(current_playing == null || current_playing != music.id){
            player.innerHTML = '<audio id="music_player"><source type="audio/mpeg" src="'+music_url+'"></audio>';
            music_player = document.getElementById("music_player");
            music_player.play();
            playing = true;
            current_playing = music.id;
            playbtn.setAttribute("src", "img/pause-circle.svg");
        }else if(playing && current_playing == music.id){
            music_player.pause();
            playing = false;
            playbtn.setAttribute("src", "img/play-circle.svg");
        }else{
            music_player.play();
            playing = true;
            playbtn.setAttribute("src", "img/pause-circle.svg");
        }
    }

});