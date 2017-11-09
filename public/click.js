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
   $scope.orderID = 0;
   $scope.removePurchase=removePurchase;
   $scope.voidTransaction=voidTransaction;

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
		  $scope.orderID++;
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
  function removePurchase($event){
	  console.log("hey");
	$scope.errorMessage='';
	for (items in $scope.order) {
		console.log("items: "+items);
		console.log("eti: "+$event.target.id);
		if ($scope.order[items].invID == $event.target.id) {
			$scope.order[items].quantity--;
			if ($scope.order[items].quantity == 0)
			{
				$scope.order.splice(items, 1);
			}
		}
	}
  }

  function voidTransaction() {
	$scope.order = [];
	  $scope.orderID = 0;
  }
  refreshButtons();  //make sure the buttons are loaded
  totalCost();
	// refreshItems()

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
