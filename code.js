var canvas;
var ctx;
var gravity = .1;
var vertices = [];
var edges = [];
var mouseCoord = {
	x: 0,
	y: 0
};
var theClicked = -1;
var selected = [0,0];
var play = false;
var select = false;
var move = false;
var verts = true;
var indexnum = 0;
var edgeindex = 0;
function edge(vert1, vert2){
	edgeindex++;
	this.equilibre = Math.sqrt(Math.pow((vert1.posx - vert2.posx),2) + Math.pow((vert1.posy - vert2.posy),2))
	this.line = function(){
		ctx.beginPath();
		ctx.moveTo(vert1.posx,vert1.posy);
		ctx.lineTo(vert2.posx,vert2.posy);
		ctx.stroke();
	}
	this.spring = function(){
		var disty = vert1.posy - vert2.posy;
		var distx = vert1.posx - vert2.posx;
		var totdist = Math.sqrt((disty*disty) + (distx*distx));
		var springacc = (this.equilibre-totdist) * 0.01;
		vert1.speedx += springacc * distx/totdist;
		vert1.speedy += springacc * disty/totdist;
		vert2.speedx -= springacc * distx/totdist;
		vert2.speedy -= springacc * disty/totdist;
	}
}
function vertex(x,y){
	this.posx = x;
	this.posy = y;
	this.speedy = 0;
	this.speedx = 0;
	this.color = "blue";
	this.numVert = indexnum;
	indexnum++;
	this.drawVert = function() {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.posx,this.posy,3,0,2*Math.PI);
		ctx.fill();
	}
	this.falling = function(){
		this.posy += this.speedy;
		this.posx += this.speedx;
		this.speedy *=.99;
		this.speedx *= .99;
	}
	
	this.collisionCheck = function(){
		if(this.posy > canvas.height){
			this.posy = canvas.height;
			this.speedy = -this.speedy;
			
		}
		
	}
	this.setColor = function(thecolor){
		this.color = thecolor;
	}
	
}


$(document).ready(function(){
	canvas = document.getElementById('thecanvas');
	ctx = canvas.getContext('2d');
	canvas.addEventListener("mousemove", function(e){
		mouseCoord.x = e.clientX - canvas.getBoundingClientRect().left;
		mouseCoord.y = e.clientY - canvas.getBoundingClientRect().top;
		
	}, false);
	var selectnum = 0;
	canvas.addEventListener("mousedown", function(e){
		mouseCoord.x = e.clientX - canvas.getBoundingClientRect().left;
		mouseCoord.y = e.clientY - canvas.getBoundingClientRect().top;
		if(select){
			move = false;
			verts = false;
			vertices.forEach(function(item){
				if(Math.sqrt(Math.pow((item.posx - mouseCoord.x),2) + Math.pow((item.posy - mouseCoord.y),2)) < 20){
					canvas.style.cursor = "pointer";
					if(selectnum > 1){
						selectnum = 0;
					}
					selected[selectnum] = item.numVert;
					selectnum++;
				}
			});
		} 
		
		if(move){
			select = false;
			verts = false;
			vertices.forEach(function(item){
				if(Math.sqrt(Math.pow((item.posx - mouseCoord.x),2) + Math.pow((item.posy - mouseCoord.y),2)) < 20){
					canvas.style.cursor = "move";
					theClicked = item.numVert;
				}

			});
		}
			
		if(verts){
			move = false;
			select = false;
			vertices[indexnum] = new vertex(mouseCoord.x, mouseCoord.y);
		}
		

	}, false);
			
			
	
	canvas.addEventListener("mouseup", function(e){
		canvas.style.cursor = "default";
		vertices[theClicked].speedx = 0;
		vertices[theClicked].speedy = 0;
		theClicked = -1;
		
	});
	
	$("#play").click(function(){
		play = !play;
	});
	$("#select").click(function(){
		select = true;
		move = false;
		verts = false;
	});
	$("#create").click(function(){
		edges[edgeindex] = new edge(vertices[selected[0]], vertices[selected[1]]);
	});
	$("#move").click(function(){
		move = true;
		verts = false;
		select = false;
	});
	$("#verts").click(function(){
		verts = true;
		move = false;
		select = false;
	});
	updater();

	
        
});

function updater() {
	ctx.clearRect(0,0, canvas.width, canvas. height);
	if(theClicked > -1){
		vertices[theClicked].posx = mouseCoord.x;
		vertices[theClicked].posy = mouseCoord.y;
	}
	edges.forEach(function(item){
		item.line();
		if(play){
			item.spring();
		}
	});
	vertices.forEach(function(item){
		
		if(item.numVert == selected[0] || item.numVert == selected[1])
			{
				item.color = "red";
			} else {
				item.color = "black";
			}
		item.drawVert();
		if(play){
			item.speedy += gravity;
			item.falling();
			item.collisionCheck();

		}
	});


	window.requestAnimationFrame(updater);

}

