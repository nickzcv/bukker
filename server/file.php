<?php

     if (!defined('_SAPE_USER')){
        define('_SAPE_USER', '69a6b26a2ff6a12aedf147b6659e87d8');
     }
     require_once(realpath($_SERVER['DOCUMENT_ROOT'].'/'._SAPE_USER.'/sape.php'));
     //$sape = new SAPE_client();
    $o = array();
    $o['force_show_code'] = true;
    $sape = new SAPE_client($o);

     echo $sape->return_links($n);

?>