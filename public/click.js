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
	refreshItems($event.target);
    // buttonApi.clickButton($event.target.id)
      //  .success(refreshItems($event.target.id))
        //.error(function(){$scope.errorMessage="Unable to click";});
  }
  function refreshItems(target){ 
 	$scope.errorMessage='';
	  var alreadyHasItem = false;
	  console.log("This is target's stuff: " + target.id);

	  for(items in $scope.order){
		if(target.id == $scope.order[items].invID){
			$scope.order[items].quantity++;
			alreadyHasItem = true;
			console.log("quantity: "+$scope.order[items].quantity);
		}
	  }

	  var newItemPrice;
	  var newItemLabel;
	  for(button in $scope.buttons){
		  console.log("buttonID at this point is: "+button.buttonID);
		  console.log("button looks like: " + button);
		if((target.id-1) == button){
			newItemPrice = $scope.buttons[button].prices;
			newItemLabel = $scope.buttons[button].label;
		}
	  }
	  console.log("at this point nip = "+newItemPrice);
	  console.log("at this point nil = "+newItemLabel);

	  if(!alreadyHasItem){
		  $scope.order.push({"buttonID":$scope.orderID,"invID":target.id,"quantity":1,"prices":newItemPrice,"label":newItemLabel,"top":(($scope.order.length)*100)+150})
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
