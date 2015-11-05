angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, socket) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.stateMessage = "";


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
   // $scope.modal.show();
  });

  // Triggered in the login modal to close it
  $scope.login = function() {
    socket.emit('login',{'username':$scope.loginData.username, 'password':$scope.loginData.password});
  };

  // Open the login modal
  $scope.logout = function() {
    socket.emit('logout');
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  //$scope.doLogin = function() {
  //  console.log('Doing login', $scope.loginData);
  //  // Simulate a login delay. Remove this and replace with your login
  //  // code if using a login system
  //  $timeout(function() {
  //    $scope.modal.hide();
  //  }, 1000);
  //
  //};

  //$scope.login();
  socket.on('login',function(data){
    //Add data to front page
    if(data.state=='success') {
      $scope.stateMessage = "";
      $scope.modal.hide();
    }
    else
      $scope.stateMessage = "Login Failed!";
    //$scope.modal.show();
  });
})

.controller("progressBar",function($scope,$timeout,Authorization){
    $scope.input = Authorization;

    var amt = $scope.input.count;

    console.log("inside pro" + $scope.input.count);

    $scope.countTo = amt;
    $scope.countFrom = 0;

    $timeout(function(){
      $scope.progressValue = amt;
    }, 200);


  })

.controller('QuizlistCtrl', function($scope) {
  $scope.quizes = [
    { title: 'Say Hello', id: 1 },
    { title: 'Print the String', id: 2 },
    { title: 'What Ever', id: 3 },
    { title: 'Play with integers', id: 4 },
    { title: 'Time Game', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('QuizCtrl', function($scope, $stateParams, $interval, socket) {
    $scope.quizTitle = $stateParams.quizId;
    $scope.questions = [{description:'Why Nadun is crazy?',options:['He is not','How could I know?','Who cares']},{description:'Why Nadun is crazy?',options:['He is not','How could I know?','Who cares']},{description:'Ho Nadun is crazy?',options:['He is not','How could I know?','Who cares']}];
    $scope.qIndex = 0;
    $scope.time = 100; //seconds
    $scope.timeElapsed = 0;

    $scope.timeFunction = $interval(function(){
      if($scope.timeElapsed<$scope.time){
        $scope.timeElapsed++;
      }
      else {
        $scope.submit();
        $interval.cancel($scope.timeFunction);
      }
    },1000);


    $scope.prev = function()
    {
      $scope.qIndex--;
    };

    $scope.next = function()
    {
      $scope.qIndex++;
    };
    //data
    $scope.submit = function()
    {
      var answers = [];
      for(var i=0; i<$scope.questions.length;i++)
      {
        answers.push($scope.questions[i].selection);
      }
      socket.emit('quiz-submit',{})
    }

    //
    //
    //$scope.problemId = $stateParams.playlistId;
    //$scope.problemDesc = "not yet implemented";
    //$scope.problemTitle = "";
    //$scope.problemExample = "";
    //if($scope.problemId=="1")
    //{
    //  $scope.problemTitle = "Say Hello";
    //  $scope.problemDesc = "Print 'Hello!'. What ever the input is the program should print 'Hello' in the standrad output.";
    //  $scope.problemExample = "Sample Output: Hello!";
    //}
})

.controller('HomeCtrl', function($scope, $stateParams) {

  $scope.suggestedQuestions = [{title:'A/L Chemestry sample paper',id:0},{title:"haha Lol paper",id:1}];


  })

  .controller('ResultCtrl', function($scope, $stateParams) {

  })

  .factory('socket',function(){
    //Create socket and connect to http://chat.socket.io
    //var myIoSocket = io.connect('http://localhost:3000');
    var myIoSocket = io.connect('https://codegameserver.herokuapp.com');


    return myIoSocket;
  });
