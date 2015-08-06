<?php

function getInfo($url)//gather info from source and prepare it for sending
{
    //get data from source
    $raw_content = file_get_contents($url);
    
    /* get everything between <tbody> tags */
    $start = "<tbody>";
    $pos_start = strrpos($raw_content, $start);
    $end = "</tbody>";
    $pos_end = strrpos($raw_content, $end);
    $table_body = substr($raw_content, $pos_start, $pos_end - $pos_start);
    
    /*using XMLDom to prepare content for building table*/
    $dom = new DOMDocument();
    $dom->loadHTML('<?xml version="1.0" encoding="UTF-8"?>'."<table>".$table_body."</tbody></table>");
    $element = $dom->documentElement;

    $return_values = array();//array of tr elements data
    
    $i = 0;
    $j = 0;
    
    foreach ($element->getElementsByTagName('tr') as $tr)//iterate on xml_dom tree, element by element
    {
        $line = array();
        $j = 0;
        foreach ($tr->childNodes as $td) 
        {
            if(!preg_match('/^[\s]+$/',$td->nodeValue))//escape empty elements
            {
                $line[$j] = trim($td->nodeValue);//cut spaces
                $j++;
            }
            
            if($td->hasChildNodes())
            {
                foreach ($td->childNodes as $td_child) 
                {
                    if($td_child->nodeType == XML_ELEMENT_NODE && $td_child->tagName === 'img')//to get src of img element
                    {
                        $line[$j] = $td_child->getAttribute('src');//
                        $j++;
                    }
                }
            }
        }
        $return_values[$i] = $line;
        $i++;
    }
    return $return_values;
}

//main
try 
{
    $url = 'http://www.vnukovo.ru/flights/online-timetable/';// '../temp/vno.php'
    $data_from_source = getInfo($url);
    $table_to_send = '<table id="table_content">';

    for($i = 0; $i < count($data_from_source); ++$i)
    {
        $table_to_send .= '<tr>';
        
            //a bit of hardcode, because source is not very good
            //and not very consistant and standard
            if(count($data_from_source[$i]) == 7)
            {
               //arrival or departure 
                
               if(preg_match('/Прилетел/', $data_from_source[$i][6]))
               {
                    $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" align="center" width="10%"><img src="img/arrival.png"/></td>';//flight type
               }
               else 
               {
                    $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="10%"><img src="img/departure.png"/></td>';//flight type
               }
               
               //flight number
               
               $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="10%"><p>'.$data_from_source[$i][1].'</p></td>';
               
               //company
               
               $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="20%"><p>'.$data_from_source[$i][2].'</p></td>';
               
               
               //dest
               
               $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="20%"><p>'.$data_from_source[$i][4].'</p></td>';
               
               
               //get time from string
               $temp = array();
               preg_match('/[\d]{2}\:[\d]{2}/', $data_from_source[$i][0], $temp);
               if(count($temp) != 0)
               {    
                   $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="10%"><p>'.$temp[0].'</p></td>';//time
               }
               else 
               {
                    $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="10%"><p>-:-</p></td>';//time
               }
               
               //status
               $table_to_send .= '<td data-title= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" text= "ТЕРМИНАЛ '.$data_from_source[$i][5].'" width="20%"><p>'.$data_from_source[$i][6].'</p></td>';
               
               //info
               $table_to_send .= '<td class="td_content_last" width="10%"><p>ТЕРМИНАЛ '.$data_from_source[$i][5].'</p></td>';
            }
        
        $table_to_send .= '</tr>';
    }
    
    $table_to_send .= '</table>';
    
    echo $table_to_send;
} 
catch (Exception $ex) 
{
    echo "ОШИБКА В ИСТОЧНИКЕ ИНФОРМАЦИИ!";
}

?>