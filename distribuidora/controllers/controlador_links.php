<?php

  class Controlador_links{

    public function controlador_links(){

        if(isset($_GET["action"])){
            $links = $_GET["action"];
        }else{
            $links = "index";
        }

        //Creamos una instacia de la clase links que se encuentra en el paquete models
        $modelo_links = new Modelo_links();
        $answer = $modelo_links->modelo_links($links);
        include $answer;

    } 
  }

