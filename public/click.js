angular.module('register',[])
  .controller('registerCtrl',RegisterCtrl)
  .factory('registerApi',registerApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

//Helpful links
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//https://www.w3schools.com/jsref/jsref_tofixed.asp


function RegisterCtrl($scope,registerApi){
   $scope.totalCost=totalCost;
   $scope.buttons=[]; //Initially all was still
   $scope.order=[];
   $scope.users=[];
   $scope.errorMessage='';
   $scope.isLoading=isLoading;
   $scope.refreshButtons=refreshButtons;
   $scope.buttonClick=buttonClick;
   $scope.orderID = 0;
   $scope.removePurchase=removePurchase;
   $scope.voidTransaction=voidTransaction;
   $scope.personLoggedIn=personLoggedIn;
   $scope.firstname="";
   $scope.firstname_final;
   $scope.lastname="";
   $scope.lastname_final;
   $scope.finalCost=0;

   var loading = false;

   function isLoading(){
    return loading;
   }
  function refreshButtons(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getButtons()
      .success(function(data){
         $scope.buttons=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Buttons:  Database request failed";
          loading=false;
      });
  }
  
  function refreshUsers(){
    loading=true;
    $scope.errorMessage='';
    registerApi.getUsers()
      .success(function(data){
         $scope.users=data;
         loading=false;
      })
      .error(function () {
          $scope.errorMessage="Unable to load Users:  Database request failed";
          loading=false;
      });
  }
  
  function personLoggedIn() {
	$scope.errorMessage='';
	  refreshUsers();
	  var loggedIn = false;
	  console.log("checkpoint 1");
	for (usernames in $scope.users)
	  {

	//	console.log($scope.users);
	//	console.log($scope.users[usernames].Firstname);
	//	console.log($scope.firstname);
		console.log("checkpoint 2");
		if ($scope.users[usernames].Firstname == $scope.firstname && $scope.users[usernames].Lastname == $scope.lastname)
		  {
			  console.log("checkpoint 3");
			$scope.personLoggedIn = $scope.firstname + " " + $scope.lastname;
			  loggedIn = true;
		  }
	  }

	  if(!loggedIn){
		$scope.personLoggedIn = "No One";
	  }
  }
  function logIn() {
	
  }

  function buttonClick($event){
     $scope.errorMessage='';
	  if($event.target.id == -1){
		personLoggedIn();
	  } else {
		refreshItems($event.target);
	  }
    // registerApi.clickButton($event.target.id)
      //  .success(refreshItems($event.target.id))
        //.error(function(){$scope.errorMessage="Unable to click";});
  }
  function refreshItems(target){ 
 	$scope.errorMessage='';
	  var alreadyHasItem = false;

	  for(items in $scope.order){
		if(target.id == $scope.order[items].invID){
			$scope.order[items].quantity++;
			alreadyHasItem = true;

		}
	  }

	  var newItemPrice;
	  var newItemLabel;
	  for(button in $scope.buttons){
		if((target.id-1) == button){
			newItemPrice = $scope.buttons[button].prices;
			newItemLabel = $scope.buttons[button].label;
		}
	  }



	  if(!alreadyHasItem){
		  $scope.order.push({"buttonID":$scope.orderID,"invID":target.id,"quantity":1,"prices":newItemPrice,"label":newItemLabel,"top":(($scope.order.length)*50)+150})
		  $scope.orderID++;
	  }
   	  totalCost(); 
  }
  function totalCost(){
	  var cost = 0;
	for(items in $scope.order){
		for(button in $scope.buttons){
			if(items.invID == button.invID){
				console.log(cost);
				cost = cost + ($scope.order[items].quantity * $scope.buttons[button].prices);
			}
		}
	}
	$scope.totalCost = cost.toFixed(2);

  }
  function itemCost(){
	//not implemented
  }
  function removePurchase($event){

	$scope.errorMessage='';
	var itemRemoved = false;
	for (items in $scope.order) {


		if ($scope.order[items].invID == $event.target.id) {
			$scope.order[items].quantity--;
			if ($scope.order[items].quantity == 0)
			{
				$scope.order.splice(items, 1);
				itemRemoved = true;
			}
		}
	}
	  if(itemRemoved){
		for(items in $scope.order){
			$scope.order[items].top=((items)*50)+150;
		}
	  }
  	totalCost();
  }

  function voidTransaction() {
	$scope.order = [];
	  $scope.orderID = 0;
	  totalCost();
  }
  
	refreshButtons();  //make sure the buttons are loaded
  	refreshUsers();
	totalCost();
	// refreshItems()

}

function registerApi($http,apiUrl){
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
    },
    getUsers: function(){
      var url = apiUrl + '/user';
      return $http.get(url);
    }
    // deleteTransaction: function(id) {
    //   var url = apiUrl + '/click?delete='+id;
    //   return $http.delete(url);
    // }
 };
}
