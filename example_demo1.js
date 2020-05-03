function makeDemo1() {                                         
    d3.tsv("example.tsv")                            
        .then( function( data ) {                              
            d3.select( "svg" )                                 
                .selectAll( "circle" )                         
                .data( data )                                  
                .enter()                                       
                .append( "circle" )                            
                .attr( "r", 5 ).attr( "fill", "red" )          
                .attr( "cx", function(d) { return d["x"] } )
                .attr( "cy", function(d) { return d["y"] } );
        } );
}

function makeDemo2() {
    d3.tsv( "example.tsv" )
        .then( function( data ) {
            var pxX = 600, pxY = 300;                             

            var scX = d3.scaleLinear()                            
                .domain( d3.extent(data, d => d["x"] ) )          
                .range( [0, pxX] );
            var scY1 = d3.scaleLinear()                           
                .domain(d3.extent(data, d => d["y1"] ) )
                .range( [pxY, 0] );                               
            var scY2 = d3.scaleLinear()
                .domain( d3.extent(data, d => d["y2"] ) )
                .range( [pxY, 0] );

            d3.select( "svg" )                                    
                .append( "g" ).attr( "id", "ds1" )                
                .selectAll( "circle" )                            
                .data(data).enter().append("circle")
                .attr( "r", 5 ).attr( "fill", "green" )           
                .attr( "cx", d => scX(d["x"]) )                   
                .attr( "cy", d => scY1(d["y1"]) );                

            d3.select( "svg" )                                    
                .append( "g" ).attr( "id", "ds2" )
                .attr( "fill", "blue" )                           
                .selectAll( "circle" )                            
                .data(data).enter().append("circle")
                .attr( "r", 5 )
                .attr( "cx", d => scX(d["x"]) )
                .attr( "cy", d => scY2(d["y2"]) );                

            var lineMaker = d3.line()                             
                .x( d => scX( d["x"] ) )                          
                .y( d => scY1( d["y1"] ) );

            d3.select( "#ds1" )                                   
                .append( "path" )                                 
                .attr( "fill", "none" ).attr( "stroke", "red" )
                .attr( "d", lineMaker(data) );                    

            lineMaker.y( d => scY2( d["y2"] ) );                  

            d3.select( "#ds2" )                                   
                .append( "path" )
                .attr( "fill", "none" ).attr( "stroke", "cyan" )
                .attr( "d", lineMaker(data) );

          d3.select( "#ds2" ).attr( "fill", "red" );            
        } );
}

function makeDemo3() {
    d3.tsv( "example.tsv" )
        .then( function( data ) {
            var svg = d3.select( "svg" );                         

            var pxX = svg.attr( "width" );                        
            var pxY = svg.attr( "height" );

            var makeScale = function( accessor, range ) {         
                return d3.scaleLinear()
                    .domain( d3.extent( data, accessor ) )
                    .range( range ).nice();
            }
            var scX  = makeScale( d => d["x"],  [0, pxX] );
            var scY1 = makeScale( d => d["y1"], [pxY, 0] );
            var scY2 = makeScale( d => d["y2"], [pxY, 0] );

            var drawData = function( g, accessor, curve ) {       
                // draw circles
                g.selectAll( "circle" ).data(data).enter()
                    .append("circle")
                    .attr( "r", 5 )
                    .attr( "cx", d => scX(d["x"]) )
                    .attr( "cy", accessor );

                // draw lines
                var lnMkr = d3.line().curve( curve )              
                    .x( d=>scX(d["x"]) ).y( accessor );

                g.append( "path" ).attr( "fill", "none" )
                    .attr( "d", lnMkr( data ) );
            }

            var g1 = svg.append( "g" );                           
            var g2 = svg.append( "g" );

            drawData( g1, d => scY1(d["y1"]), d3.curveStep );     
            drawData( g2, d => scY2(d["y2"]), d3.curveNatural );

            g1.selectAll( "circle" ).attr( "fill", "green" );     
            g1.selectAll( "path" ).attr( "stroke", "cyan" );

            g2.selectAll( "circle" ).attr( "fill", "blue" );
            g2.selectAll( "path" ).attr( "stroke", "red" );

            var axMkr = d3.axisRight( scY1 );                     
            axMkr( svg.append("g") );                             

            axMkr = d3.axisLeft( scY2 );
            svg.append( "g" )
                .attr( "transform", "translate(" + pxX + ",0)" )  
                .call( axMkr );                                   

            svg.append( "g" ).call( d3.axisTop( scX ) )
                .attr( "transform", "translate(0,"+pxY+")" );     
        } );
}
