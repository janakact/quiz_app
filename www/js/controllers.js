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
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/loading.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loadingModel = modal;
    $scope.loadingModel.show();

  });

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


.controller('CourseCtrl', function($scope) {
  $scope.courses = [
    { title: 'Database Management Systems', id: 1 },
    { title: 'Computer Networks', id: 2 },
    { title: 'Data Mining', id: 3 },
    { title: 'Software Engineering', id: 4 },
    { title: 'Photography', id: 5 },
    { title: 'Technical Writing', id: 6 }
  ];

  $scope.pubCourses = [
    { title: 'Introduction to Biology', id: 1 },
    { title: 'Graph Theory', id: 2 },
    { title: 'Linear Algebra', id: 3 },
    { title: 'Calculus', id: 4 },
    { title: 'Differential equations', id: 5 }
  ];
})

.controller('QuizCtrl', function($scope,$ionicModal, $stateParams, $interval, $location,socket) {
  //Dummmy data
  //  $scope.questions = [{description:'Why Nadun is crazy?',options:['He is not','How could I know?','Who cares']},{description:'Why Nadun is crazy?',options:['He is not','How could I know?','Who cares']},{description:'Ho Nadun is crazy?',options:['He is not','How could I know?','Who cares']}];
    $scope.qIndex = 0;
    $scope.time = 100; //seconds
  //
  //  $scope.data = "haha";



  $scope.quizId = $stateParams.quizId;
  socket.emit('getQuiz',{qid:$scope.quizId});


  // ------------------Models
  $ionicModal.fromTemplateUrl('templates/result.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.resultModal = modal;
  });




    socket.on('showQuiz',function(data)
    {
      if(data.QuizID!=$scope.quizId) return;
      ///Add retur if ids not match
      $scope.data = data;
      $scope.questions = [];
      $scope.time = data.Time;
      $scope.quizTitle = data.Name;
      $scope.quizCourse = data.CourseID;
      var questions = data.Questions;
      for(var i=0; i<questions.length;i++)
      {
        q = questions[i];
        $scope.questions.push({description:q.Q ,options: q.O, answer: q.A});
      }

      //Statr timer
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
      $scope.loadingModel.hide();

    });




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
      var result = 0;
      for(var i=0; i<$scope.questions.length;i++)
      {
        if($scope.questions[i].selection==$scope.questions[i].answer)
          result++;
      }
      socket.emit('sendResult',{result:result,qid:$scope.quizId,count:$scope.questions.length});
      $scope.result = result;
      $interval.cancel($scope.timeFunction);
      $scope.resultModal.show();
    }


    $scope.closeResults = function()
    {
      $location.path('/');
      $scope.resultModal.hide();
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

.controller('HomeCtrl', function($scope, $location, $stateParams,socket) {
 // $scope.loadingModel.show();
  socket.emit('allQuiz',{});
  socket.on('showQuiz',function(data) {
    if(typeof(data.QuizID) !== 'undefined' )   return;
    $scope.data = data;
    var quizes = [];

    for(var i=0; i<data.length;i++)
    {
          quizes.push({title:data[i].Name,id:data[i].QuizID,time:data[i].Time});
    }
    $scope.suggestedQuizes = quizes;
    $scope.$apply();
    $scope.loadingModel.hide();
    });
  //Dumy data
  //$scope.suggestedQuizes = [{title:'A/L Chemestry a sample paper',id:35},{title:"haha Lol paper",id:35}];
  $scope.recentAttempts = [{title:'A/L Chemestry sample paper',result:1,count:3},{title:"haha Lol paper",result:3,count:3},{title:'A/L Chemestry sample paper',result:3,count:3}]

  $scope.goToSearch = function()
  {
    $location.path('/app/searchresult');
  }



  })


  .controller('QuizlistCtrl', function($scope,socket) {
    $scope.loadingModel.show();
    socket.emit('allQuiz',{});
    socket.on('showQuiz',function(data) {
      if(typeof(data.QuizID) !== 'undefined' )   return;
      $scope.data = data;
      var quizes = [];

      for(var i=0; i<data.length;i++)
      {
        quizes.push({title:data[i].Name,id:data[i].QuizID,time:data[i].Time});
      }
      $scope.quizes = quizes;
      $scope.$apply();
      $scope.loadingModel.hide();
    });

    //$scope.quizes = [
    //  { title: 'Say Hello', id: 35 },
    //  { title: 'Print the String', id: 2 },
    //  { title: 'IPv4', id: 3 },
    //  { title: 'Play with integers', id: 4 },
    //  { title: 'Time Game', id: 5 },
    //  { title: 'LAN', id: 6 }
    //];
  })

  .controller('ResultCtrl', function($scope, $stateParams) {

  })

  .controller('SearchResultCtrl', function($scope, $stateParams,socket) {

    socket.emit('allQuiz',{});
    socket.on('showQuiz',function(data) {
      if(typeof(data.QuizID) !== 'undefined' )   return;
      $scope.data = data;
      var quizes = [];

      for(var i=0; i<data.length;i++)
      {
        quizes.push({title:data[i].Name,id:data[i].QuizID,time:data[i].Time,courseId:data[i].CourseID});
      }
      $scope.quizes = quizes;
      $scope.$apply();
      $scope.loadingModel.hide();
    });

  })

  .factory('socket',function(){
    //Create socket and connect to http://chat.socket.io
    //var myIoSocket = io.connect('http://localhost:3000');
    //var myIoSocket = io.connect('https://codegameserver.herokuapp.com');
    var myIoSocket = io.connect('http://104.131.189.142:3000');


    return myIoSocket;
  })
