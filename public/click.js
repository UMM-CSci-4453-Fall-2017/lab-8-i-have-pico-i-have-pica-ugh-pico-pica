https://github.com/UMM-CSci-4453-Fall-2017/lab-8-i-have-pico-i-have-pica-ugh-pico-picaangular.module('buttons',[])
  .controller('buttonCtrl',ButtonCtrl)
  .factory('buttonApi',buttonApi)
  .constant('apiUrl','http://localhost:1337'); // CHANGED for the lab 2017!

//Helpful links
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//https://www.w3schools.com/jsref/jsref_tofixed.asp


function ButtonCtrl($scope,buttonApi){
   $scope.currentPrice=0;
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
        .success(refreshItems)
        .error(function(){$scope.errorMessage="Unable to click";});
  }
  function refreshItems(){
    loading=true;
    $scope.errorMessage='';
    buttonApi.getItems()
      .success(function(data){
        $scope.order=data;
        $scope.currentPrice=0;
        data=data.map(function(item) {
          var priceToBeAdded = (item.count * item.price).toFixed(2);
          item.price = (item.price).toFixed(2);
          $scope.currentPrice += priceToBeAdded;
          return item;
        });
        $scope.currentPrice = ($scope.currentPrice).toFixed(2);
        loading=false;
      })
      .error(function() {
        $scope.errorMessage="Item load request failed!";
        loading=false;
      });
  }
  refreshButtons();  //make sure the buttons are loaded
  refreshItems();

}

function buttonApi($http,apiUrl){
  return{
    getButtons: function(){
      var url = apiUrl + '/buttons';
      return $http.get(url);
    },
    getItems: function(id) {
      var url = apiUrl + '/item='+id;
      return $http.get(url);
    },
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
