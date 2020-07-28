function girarArray(array){
    
    arrayAlrevez = new Array
    contador = 1
    while(contador <= array.length){
        arrayAlrevez.push(array[array.length-contador])
        
        contador++
    }
    return arrayAlrevez
}

function Plano3D(){
    
    this.plano = new Object()
    
    this.setCasilla = (x, y, z, ficha ) => {

        this.plano["x" + x + "y" + y + "z" + z] = ficha

    }
    this.getCasilla = (x, y, z ) => {
        
        if ( ! this.plano.hasOwnProperty("x" + x + "y" + y + "z" + z ) ){
            
            this.plano["x" + x + "y" + y + "z" + z] = 'rgba(0,0,0,0.01)'
        }
        
        return this.plano["x" + x + "y" + y + "z" + z]
    }
}

function moverPuntero (puntero, direccion){
    
    puntero = puntero
    
    switch (direccion) {
        case "-y":
            puntero[1] -= 1
            return puntero

        case "-z":
            puntero[2] -= 1
            return puntero

    }
}

function sondeoDiagonal(angulo,posicion, profundidad, pasoPar){
    
    contenido = new Array
     
    puntero = posicion
    
    pasoPar = pasoPar

    sumaIntensidadColoresDeLasCasillas = 0
    
    movs = 0
    
    /*'rgba(255, 25, 250, 1)'*/
    while(sumaIntensidadColoresDeLasCasillas < 1 && movs < profundidad ){
        
        direccion = null
        
        if (pasoPar){
            direccion = angulo[0]
        }else{
            direccion = angulo[1]
        }
        
        puntero = moverPuntero(puntero, direccion) 
    
        pasoPar = !pasoPar
        
        color = planoTridimensional.getCasilla(puntero[0], puntero[1], puntero[2])
        
        sumaIntensidadColoresDeLasCasillas += parseInt(color.split(",")[3])
        
        contenido.push(color)
        
        movs++
        
    }
    contenido = girarArray(contenido)
    return contenido   
}

function visor(lugarVisor, distanciaDeVicion, angulo, lugarPantalla, lugarCentroPantalla){
    
    puntero = new Array()
    lugarVisor.forEach((eje)=>{
        puntero.push(eje)
    })
    //alejo el punto para posicionar la sonda
    angulo.forEach((inclinacion) => {

        switch (inclinacion){
            case "-y":
                puntero[1] += distanciaDeVicion
                break;
            
            case "-z":
                puntero[2] += distanciaDeVicion    
        }    
    })
 
    desface= new Array
    desface[0]=lugarPantalla[0]-lugarCentroPantalla[0]
    desface[1]=lugarPantalla[1]-lugarCentroPantalla[1]

    segundoMov = true
    if (desface[1]%2 != 0 ){
        segundoMov = false
        desface[1] -= 1
    }
    
    desface[1] = desface[1]/2
    
    puntero[0] += desface[0]  
    puntero[1] += desface[1]
    puntero[2] -= desface[1]

    return sondeoDiagonal(angulo, puntero, distanciaDeVicion*4, segundoMov)    
    //Return [color1,color2]
}


function Tablero(){

    this.alto=1200
    this.ancho=1800
    
    this.filas=24
    
    this.columnas=36
        
    this.porteCuadrados =100
    
    this.vista = ["-y","-z"] //abajo profundo
    this.puntoDeVista =[0,0,0]
    
    this.distanciaDeVicion =12
    
    this.obtenerCentroPantalla = ()=>{
        
        centroPantalla = new Array
        
        if (this.columnas%2 > 0){
            centroPantalla.push( ( (this.columnas-1)/2)+1 )
        }else{
            centroPantalla.push( this.columnas/2 )
        }
        if (this.filas%2 > 0){
            centroPantalla.push( ( (this.filas-1)/2)+1 )
        }else{
            centroPantalla.push( this.filas/2 )
        }
        
        return centroPantalla
           
    }
    
    this.dibujar = (ctx ) => {
        
        for( a=0; a<this.columnas; a++){ //x
            for( b=0; b<this.filas; b++){ //y

                fichasSondeadas = visor( this.puntoDeVista, this.distanciaDeVicion, this.vista, [a,this.filas -b], this.obtenerCentroPantalla())
                
                fichasSondeadas.forEach(( color) => {
                    
                    var rectangle = new Path2D();

                    rectangle.rect(this.ancho/this.columnas*a,
                                   this.alto/this.filas*b,
                                   this.ancho/this.columnas,
                                   this.alto/this.filas);

                    ctx.fillStyle = color;
                        /*ctx.stroke(rectangle);*/
                    ctx.fill(rectangle);

                    ctx.lineWidth = 1   
                })
            }
        }
    }
}

planoTridimensional = new Plano3D

var canvas = document.getElementById('tutorial');

function draw(tablero){
    var ctx = canvas.getContext('2d');
        
    //llena el canvas de pixeles blancos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

    ctx.fillRect(0,0,canvas.width,canvas.height);

    tablero.dibujar(ctx)
}

tablero = new Tablero()

draw(tablero)

//Aplicacion

function pintarMasActualizar(x,y,z,colorEnRGBA){
    planoTridimensional.setCasilla(x,y,z,colorEnRGBA)
    draw(tablero)
}

function moverteYPintar(eje, masOMenos){

    tablero.puntoDeVista[eje] += masOMenos

    erre = tablero.puntoDeVista[0] * 5 +130
    ge = tablero.puntoDeVista[1] * 5 +130
    be = tablero.puntoDeVista[2] * 5 +130
    a = 0.5//Math.random();


    rgba = `rgba(${erre}, ${ge}, ${be}, ${a})`

    pintarMasActualizar( tablero.puntoDeVista[0], tablero.puntoDeVista[1], tablero.puntoDeVista[2], rgba)
}

document.addEventListener('keydown', (event) => {
    switch(event.key){
        case "w":
            moverteYPintar(2,-1)
            break;
        case "s":
            moverteYPintar(2,1)
            break;
        case "a":
            moverteYPintar(0,-1)
            break;
        case "d":
            moverteYPintar(0,1)
            break;
        case "x":
            moverteYPintar(1,-1)
            break;       
    }

    if(event.keyCode == 32){
        moverteYPintar(1,1)
    }
  });
