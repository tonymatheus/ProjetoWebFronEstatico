angular.module("hackaton-stefanini").controller("PerfilListarController", PerfilListarController);
PerfilListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfilListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.qdePorPagina = 5;
    vm.ultimoIndex = 0;
    vm.contador = 0;
    vm.url = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (responsePerfil) {
                console.log('Reposta: ', responsePerfil);
                
                if (responsePerfil.data !== undefined)
                    vm.listaPerfil = responsePerfil.data;

                vm.listaPerfilMostrar = [];
                var max = vm.listaPerfil.length > vm.qdePorPagina ? vm.qdePorPagina : vm.listaPerfil.length;

                vm.qdePaginacao = new Array(vm.listaPerfil.length % vm.qdePorPagina === 0 ? vm.listaPerfil.length / vm.qdePorPagina : parseInt(vm.listaPerfil.length / vm.qdePorPagina) + 1);
                vm.currentPage = 1;
                for (var count = 0; count < max; count++) {
                    vm.listaPerfilMostrar.push(vm.listaPerfil[count]);
                    vm.ultimoIndex++;
                }

                vm.listaPerfilMostrar.sort(function (a, b) {
                    return a.id - b.id;
                });

                HackatonStefaniniService.listar(vm.urlEndereco).then(
                    function (responseEndereco) {
                        console.log('ResponseEndereco: ', responseEndereco);
                        
                        if (responseEndereco.data !== undefined)
                            vm.listaEndereco = responseEndereco.data;
                    }
                );
            }
        );
    };

    vm.atualizarPaginanacao = function (index) {

        if (index >= vm.currentPage)
            vm.avancarPaginanacao(index);
        else
            vm.retrocederPaginanacao(index);
    };

    vm.avancarPaginanacao = function (index) {
        
        vm.listaPerfilMostrar = [];
        vm.currentPage++;

        var idx = angular.copy(vm.ultimoIndex);
        var cont = vm.listaPerfil.length - vm.qdePorPagina;
        for (var count = cont > vm.qdePorPagina ? vm.qdePorPagina : cont; count > 0; count--) {
            vm.listaPerfilMostrar.push(vm.listaPerfil[idx++]);
            vm.ultimoIndex++;
            vm.contador++;
        }
        vm.listaPerfilMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.retrocederPaginanacao = function (index) {
        
        vm.listaPerfilMostrar = [];

        vm.currentPage--;
        var idx = vm.contador - 1;
        vm.ultimoIndex = idx + 1;
        for (var count = vm.qdePorPagina; count > 0; count--) {
            vm.listaPerfilMostrar.push(vm.listaPerfil[idx--]);
            vm.contador--;
        }
        vm.listaPerfilMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPerfil/" + id);
        else
            $location.path("cadastrarPerfil");
    }

    vm.remover = function (id) {

        var liberaExclusao = true;

        angular.forEach(vm.listaEndereco, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusao = false;
        });

        if (liberaExclusao)
            HackatonStefaniniService.excluir(vm.url + id).then(
                function (response) {
                    vm.init();
                }
            );
        else {
            alert("Pessoa com Endereço vinculado, exclusão não permitida");
        }
    }

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfil");
    }

}