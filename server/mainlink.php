<?php
    include_once($_SERVER['DOCUMENT_ROOT'].'/mainlink/mainlink.php');
    $o['USERNAME'] = '247C1B547C1E788AB592E977440ECED2';
    $client_lnk = new MLClient($o);
    echo $client_lnk->build_links();
?>