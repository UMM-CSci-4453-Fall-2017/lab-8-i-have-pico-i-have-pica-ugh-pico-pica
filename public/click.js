angular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

//Helpful links
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//https://www.w3schools.com/jsref/jsref_tofixed.asp


function ButtonCtrl($scope,buttonApi){
   $scope.totalCost=totalCost;
   $scope.buttons=[]; //Initially all was still
   $scope.order=[];
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
  }
  function buttonClick($event){
     $scope.errorMessage='';
     buttonApi.clickButton($event.target.id)
        .success(refreshItems($event.target.id))
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  function refreshItems(id){ 
 	$scope.errorMessage='';
	  var alreadyHasItem = false;
	  for(items in $scope.order){
		if(id == items.invID){
			items.quantity++;
			alreadyHasItem = true;
		}
	  }

	  if(!alreadyHasItem){
		  $scope.order.push({"buttonID":$scope.orderID,"invID":id,"quantity":1})
	  }
    
  }
  function totalCost(){
	  var cost = 0;
	for(items in $scope.order){
		for(button in $scope.buttons){
			if(items.invID == button.invID){
				cost = cost + (items.quantity * button.prices);
			}
		}
	}

  }
  function orderClick($event){
	$scope.errorMessage='';
	  
  }
  refreshButtons();  //make sure the buttons are loaded
  totalCost();
	// refreshItems();

}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
//    getItems: function(id) {
//      var url = apiUrl + '/item='+id;
//      return $http.get(url);
//    },
    clickButton: function(id){
      var url = apiUrl+'/click?id='+id;
      return $http.post(url); // Easy enough to do this way
    }
    // deleteTransaction: function(id) {
    //   var url = apiUrl + '/click?delete='+id;
    //   return $http.delete(url);
    // }
 };
}
