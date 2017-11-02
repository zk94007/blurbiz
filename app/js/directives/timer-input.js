angular
    .module("Blurbiz")
    .directive('timeFormat', function( $filter ) {
        return {
            require: '?ngModel',
            scope: {
                ngModel: '=ngModel',
                maxTime: '@'
            },
            link: function(scope, elem, attr, ctrl) {              
               
                var getFormattedValue = function(value) {                    
                    try {
                      var newval=value.replace(/[^0-9,^:]+/g,'');
                      // console.log(newval);
                      var minutes= parseInt(newval.split(':')[0].substr(0, 2)); 
                      var seconds= parseInt(newval.split(':')[1].substr(0, 2));
                      minutes=(minutes>59)?59:((minutes>=0)?minutes:0);
                      seconds=(seconds>59)?59:((seconds>=0)?seconds:0);
                      minutes=(minutes<10)?('0'+minutes.toString()):minutes.toString();
                      seconds=(seconds<10)?('0'+seconds.toString()):seconds.toString();
                      
                        newval = minutes+':'+seconds;
                        // validate time if there is maximum time
                        if(scope.maxTime)
                        {
                          //console.log(scope.maxTime);
                          var max_minutes=parseInt(scope.maxTime.split(':')[0]);
                          var max_seconds=parseInt(scope.maxTime.split(':')[1]);
                          if(parseInt(minutes)>max_minutes||(parseInt(minutes) == max_minutes) && parseInt(seconds)>max_seconds)
                            newval = scope.maxTime;
                        }
                        
                        return newval;
                    } catch (err) {
                        console.error(err, "00:00 used");
                        debugger;
                        return "00:00";
                    }
                }

                // better to wait till input is finished editing to format and remove unacceptable characters so that it is more easier for user to enter timer
                elem.on('blur', function() {
                    var value = getFormattedValue(elem.val());
                    scope.ngModel=value;
                });
                
                scope.$watch('maxTime', function(value, oldVal) {
                    console.log("maxTime Changed: ", value, oldVal);
                    // console.log(elem[0]);
                    // console.log(elem.val());
                    // console.log("ngModel: ", scope.ngModel);
                    var value = getFormattedValue(elem.val());
                    scope.ngModel=value;
                });
                
//                var element = elem;
//               
//                ctrl.$formatters.push(function(value) {
//                    if(value){
//                      value = getFormattedValue(value);
//                      element.val(value);
//                    }                    
//                  return value;
//                });
//
//                 ctrl.$parsers.push(function(value) {
//                     if(value){
//                         value = getFormattedValue(value);
//                         element.val(value);
//                     }                    
//                     return value;
//                 });                 
                
                
            }
        }   
    })
    .directive("timerInput", function($timeout) {
        return {
            require: 'ngModel',
            replace: true,
            scope: {
                ngModel: '=ngModel'
            },
            link: function(scope, elem, attrs, ctrl) {
                // if (!ctrl)
                //     return;
                // var timerValue = attrs.timerInput;
                // attrs.$observe('timerInput', function(newValue) {
                //     if (timerValue == newValue || !ctrl.$modelValue) return;
                //     timerValue = newValue;
                //     ctrl.$modelValue = ctrl.$setViewValue;
                // });

                var getFormattedValue = function(value) {
                    value = getRangedValue(value);
                    value = value < 10 ? ("0" + value) : ("" + value);
                    return value;
                }

                var getRangedValue = function(value) {
                    try {
                        value = parseInt(value);
                        if (value > 60)
                            return 60;
                        if (value < 0)
                            return 0;
                        return value;
                    } catch (err) {
                        return 0;
                    }
                }

                var element = elem;
               
                // ctrl.$formatters.push(function(value) {
                //    console.log("formatter invoked: ", value);
                //    if(value){
                //      value = getFormattedValue(value);
                //      element.val(value);
                //    }                    
                //  return value;
                // });

                 ctrl.$parsers.push(function(value) {
                     // console.log("parser invoked: ", value);
                     if(value){
                         value = getFormattedValue(value);
                         element.val(value);
                     }                    
                     return value;
                 });

                // angular.element(elem).on('keypress change', function(e) {
                //    $timeout(function() {
                //        var value = e.currentTarget.value;
                //        console.log(value);
                //        value = getFormattedValue(value);
                //        elem.val(value);
                //        e.preventDefault();
                //    }, 0);
                   
                // });

                 scope.$watch('ngModel', function(value) {
                     // console.log("ngModel Changed "+value);
                     value = getFormattedValue(value);
                     element.val(value);
                 });
            }
        }
    });