//wczytaj dźwięk
var tick = new Audio("sound/tick.mp3");
var win = new Audio("sound/win.wav");

//zmienne
var znak = "x";
var zajete = [];
var zwycieztwo= 0;
var puste_pola = 9;
var bot_toggle = 0;
var konsola="";

function start() {
    stworz();
    losuj_znak();
    skala();
}

function skala() {
    var szerokosc_okna = $(window).width();
    var wysokosc_okna = $(window).height();
    
    if(szerokosc_okna<1000){
        $('.pole').css('width', ((szerokosc_okna/3)-18));
        var szerokosc_pola =  $('.pole').width();
        $('.pole').css('height', szerokosc_pola);
        $('.pole').css('font-size', szerokosc_pola);
        
        $('#plansza').css('width', ((szerokosc_pola*3)+20));
        $('#konsola').css('height', szerokosc_pola);
    }
}

function losuj_znak() {
    
    var polowa = 0.5;
    
    while(polowa==0.5)
    {
        polowa = Math.random();
    }
    
    var liczba= Math.round(polowa);
    
    if(liczba==1) znak="x";
    else znak="o";
    
}

function stworz() {
    
    var pojemnik = "";
    
    for (x=0; x<9;x++) {
        pojemnik+="<div onclick='wybor("+x+");' class='pole' id='pole" + x + "'></div>";
        if((x+1)%3==0) pojemnik+="<div style='clear:both;'></div>";
    }
    
    $("#plansza").html(pojemnik);
    for (i=0; i<9;i++) zajete[i] = $("#pole"+i).html();
}

function wybor(x) {
    
    tick.play();
    
    if(zajete[x]=="" && zwycieztwo==0){
    
        $('#pole'+x).html(znak).css('cursor','default');
    
        if(znak=="x") znak="o"; else znak="x";
        
        konsola = ('<p>teraz gra znak '+znak+'</p>') + konsola;
        $('#konsola').html(konsola);
        
        puste_pola--;
        
        if(puste_pola==0){
            zwycieztwo=1;
            konsola = ('<p>nikt nie wygrał wcisnij restart</p>') + konsola;
            $('#konsola').html(konsola);
        }
        
    } else {
        if(zwycieztwo==0){
        konsola = ('<p>przeciez w polu ' + x + ' jest znak ' + $('#pole'+x).html() + '</p>') + konsola;
        $('#konsola').html(konsola);
        }
    }

    sprawdz_rzedy();
    
    if(bot_toggle==1&&znak=="o")bot_play();
}

function sprawdz_rzedy() {
    
    for (i=0; i<9;i++) zajete[i] = $("#pole"+i).html();
    
    //pion 
    for(x=0;x<=2;x++) 
        {
            //pion
            if(zajete[x]==zajete[x+3] && zajete[x]==zajete[x+6] && zajete[x+3]==zajete[x+6] && zajete[x]!="") wygrana(x,1);
            //poziom
            if(zajete[x*3]==zajete[x*3+1] && zajete[x*3]==zajete[x*3+2] && zajete[x*3+1]==zajete[x*3+2] && zajete[x*3]!="") wygrana(x,2);
        }
    
    //skos "/"
    if(zajete[0]==zajete[4] && zajete[0]==zajete[8] && zajete[4]==zajete[8] && zajete[0]!="") wygrana(0,3);
    //skos "\"
    if(zajete[2]==zajete[4] && zajete[2]==zajete[6] && zajete[4]==zajete[6] && zajete[2]!="") wygrana(0,4);

}

function wygrana(co,gdzie) {
    
    win.play();
    zwycieztwo = 1;
    
    if(znak=="x") znak="o"; else znak="x";
    
    konsola = ('<p>wygrywa ' +znak+'</p>') + konsola;
    $('#konsola').html(konsola);
    
    if(znak=="x") znak="o"; else znak="x";
    
    switch(gdzie)
    {
        case 1:
            
            $("#pole"+co).css('background-color','green');
            $("#pole"+(co+3)).css('background-color','green');
            $("#pole"+(co+6)).css('background-color','green');
            
            break; //pion
            
        case 2:
            
            $("#pole"+(co*3)).css('background-color','green');
            $("#pole"+(co*3+1)).css('background-color','green');
            $("#pole"+(co*3+2)).css('background-color','green');
            
            break; //poziom
            
        case 3:
            
            $("#pole"+0).css('background-color','green');
            $("#pole"+4).css('background-color','green');
            $("#pole"+8).css('background-color','green');
            
            break; //skos "/"
            
        case 4:
            
            $("#pole"+2).css('background-color','green');
            $("#pole"+4).css('background-color','green');
            $("#pole"+6).css('background-color','green');
            
            break; //skos "\"
    }
    
    for (b=0;b<9;b++) {
        $("#pole"+b).attr("onclick","").css('cursor','default'); 
        zajete[b] = "";
    }
    
}

function clean() {
    
    zwycieztwo = 0;
    puste_pola=9;
    konsola="";
    
    if(znak=="x") znak="o"; else znak="x";
    
    konsola = ('<p>teraz gra znak '+znak+'</p>') + konsola;
    $('#konsola').html(konsola);
    
    for (x=0;x<9;x++)
    {
        $('#pole'+x).html("").css('cursor','pointer').css('background-color','#eee').attr("onclick","wybor("+x+");");
        zajete[x] = $("#pole"+x).html();
    }
    
    if(bot_toggle==1&&znak=="o")bot_play();
    
}

function bot_switch() {
    clean();
    if(bot_toggle==0)
    {
        bot_toggle=1;
        $('#bot_toggle').html('wyłącz bota');
    } else {
        bot_toggle=0;
        $('#bot_toggle').html('włącz bota');
    }
    if(bot_toggle==1&&znak=="o")bot_play();
    
}

function bot_play() {
    
    if(zwycieztwo==0){
    
    var wybor_bota;

    for(x=0;x<=2;x++) 
        {
            //pion
            if(zajete[x]==zajete[x+3] && zajete[x]!="") if(zajete[x+6]=="") wybor_bota=x+6;
            if(zajete[x]==zajete[x+6] && zajete[x]!="") if(zajete[x+3]=="") wybor_bota=x+3;
            if(zajete[x+3]==zajete[x+6] && zajete[x+3]!="") if(zajete[x]=="") wybor_bota=x;
            //poziom
            if(zajete[x*3]==zajete[x*3+1] && zajete[x*3]!="") if(zajete[x*3+2]=="") wybor_bota=x*3+2;
            if(zajete[x*3]==zajete[x*3+2] && zajete[x*3]!="") if(zajete[x*3+1]=="") wybor_bota=x*3+1;
            if(zajete[x*3+1]==zajete[x*3+2] && zajete[x*3+1]!="") if(zajete[x*3]=="") wybor_bota=x*3;
        }

    if(zajete[0]==zajete[4] && zajete[0]!="") if(zajete[8]=="") wybor_bota=8;
    if(zajete[0]==zajete[8] && zajete[0]!="") if(zajete[4]=="") wybor_bota=4;
    if(zajete[4]==zajete[8] && zajete[4]!="") if(zajete[0]=="") wybor_bota=0;
    
    if(zajete[2]==zajete[4] && zajete[2]!="") if(zajete[6]=="") wybor_bota=6;
    if(zajete[2]==zajete[6] && zajete[2]!="") if(zajete[4]=="") wybor_bota=4;
    if(zajete[4]==zajete[6] && zajete[4]!="") if(zajete[2]=="") wybor_bota=2;
        
    if(wybor_bota==null){
        
        wybor_bota = Math.round(Math.random() * 8);
    
        while (zajete[wybor_bota]=="x" || zajete[wybor_bota]=="o")
        {
            wybor_bota = Math.round(Math.random() * 8);
        }
        
    }
    
    if(zajete[wybor_bota]=="") wybor(wybor_bota);
    }
}