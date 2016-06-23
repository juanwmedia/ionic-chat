function ChatController($scope, $firebaseArray, $firebaseAuth, $ionicScrollDelegate) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true;
    $scope.nuevoMensaje = '';
    $scope.autenticado = false;
    $scope.usuario = null;

    // Autentifiación
    var auth = $firebaseAuth();

    $scope.conectar = function() {
        auth.$signInWithPopup("google").then(function(firebaseUser) {
        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    };

    $scope.desconectar = function() {
        auth.$signOut();
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
        if (firebaseUser) {
            console.log("Signed in as:", firebaseUser);
            $scope.autenticado = true;
            $scope.usuario = firebaseUser;
        } else {
            console.log("Signed out");
            $scope.autenticado = false;
            $scope.usuario = null;
        }
    });

    // Real-time database
    var referencia = firebase.database().ref().child("mensajes");
    $scope.chats = $firebaseArray(referencia);

    referencia.on('value', function(snapshot){
        $ionicScrollDelegate.$getByHandle('mensajes').scrollBottom(true);
    });

    $scope.enviarMensaje = function() {
        $scope.chats.$add({
            mensaje: $scope.nuevoMensaje,
            usuario: $scope.usuario.displayName,
            avatar: $scope.usuario.photoURL,
            uid: $scope.usuario.uid
        });

        $scope.nuevoMensaje = '';
    };

    $scope.borrarMensaje = function(mensaje) {
        $scope.chats.$remove(mensaje);
    };
}

angular
    .module('chatID3')
    .controller('ChatController', ChatController);