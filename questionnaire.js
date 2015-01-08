angular.module( 'QuestionnaireApp', [] )
   .controller( 'QuestionnaireController', [ '$scope', '$http', '$location', function( $scope, $http, $location ) {
      DEBUG_SCOPE = $scope;

      $scope.sections = undefined;
      $scope.progress = undefined;

      $http.get( "data.yaml" )
         .then( function( resource ) {
            $scope.sections = jsyaml.safeLoad( resource.data ).sections;

            var questions = 0;
            $scope.sections.forEach( function( section ) {
               section.id = section.id || section.title;

               section.questions.forEach( function( question ) {
                  question.id = question.id || question.title;
                  question.index = ++questions;

                  question.answers.forEach( function( answer, index, answers ) {
                     if( typeof( answer ) === "string" ) {
                        answers[ index ] = answer = { title: answer };
                     }
                     answer.id = answer.id || answer.title;
                  });
               });
            });
         });

      $scope.$watch( "sections", updateProgress, true );
      function updateProgress() {
         if( !$scope.sections ) {
            return;
         }
         $scope.progress = $scope.sections.reduce( function( progress, section ) {
            section.questions.reduce( function( progress, question ) {
               var haveAnswer = false;
               if( question.selectedAnswer || question.preferNotToSay ) {
                  haveAnswer = true;
               }
               else {
                  haveAnswer = question.answers.reduce( function( value, answer ) {
                     value = value || answer.selected;
                     return value;
                  }, false ) ;
               }
               if( haveAnswer ) {
                  ++progress.answered;
               }
               else {
                  ++progress.unanswered;
               }
               return progress;
            }, progress );
            return progress;
         }, { answered: 0, unanswered: 0 } );

         $scope.progress.percentage = $scope.progress.answered * 100 / ($scope.progress.answered + $scope.progress.unanswered);
      }

      $scope.eraseAnswer = function( question ) {
         if( question.selectedAnswer ) {
            question.selectedAnswer = "";
         }
         question.answers.forEach( function( answer ) {
            if( answer.selected ) {
               answer.selected = false;
            }
         });
      }
   }]);
