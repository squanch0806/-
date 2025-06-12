class Star {
  constructor() {
    let x = width/2;
    let y = 40;
    
    let sizeCategory = random();
    if (sizeCategory < 0.70) {
      this.r = random(7, 12);
    } else if (sizeCategory < 0.98) {
      this.r = random(15, 22);
    } else {
      this.r = random(30, 40);
    }
    this.c = "#FFD700";
    this.done = false;
    this.points = 5;
    this.innerRadius = this.r * 0.6;
    
    this.body = Bodies.circle(x, y, this.r, {restitution: 0.8});
    let velocity = Vector.create(random(-0.3, 0.3), random(0.2, 0.5));
    Body.setVelocity(this.body, velocity);
    Composite.add(engine.world, this.body);
    
    this.lastCollisionTime = 0;
    this.collisionForce = 0;
  }
  
  display() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    
    let squash = this.getExtremeSquash();
    scale(squash.x, squash.y);
    
    drawingContext.shadowBlur = this.r;
    drawingContext.shadowColor = "#FFD700";
    
    fill(this.c);
    stroke('#FFC300');
    strokeWeight(1);
    this.drawStar(this.r);
    
    pop();
  }
  
  getExtremeSquash() {
    let baseX = 1.0;
    let baseY = 1.0;
    
    let jellyEffect = this.getJellySquash();
    
    return {
      x: baseX * jellyEffect.x,
      y: baseY * jellyEffect.y
    };
  }
  
  getJellySquash() {
    if (this.collisionForce === 0) return {x: 1, y: 1};
    
    let timeSince = millis() - this.lastCollisionTime;
    let recovery = constrain(timeSince / 250, 0, 1);
    
    let jellyPhase;
    if (recovery < 0.3) {
      jellyPhase = recovery / 0.3;
      let squashX = lerp(1.0, 1.4, jellyPhase);
      let squashY = lerp(1.0, 0.6, jellyPhase);
      return {x: squashX, y: squashY};
      
    } else if (recovery < 0.7) {
      jellyPhase = (recovery - 0.3) / 0.4;
      let stretchX = lerp(1.4, 0.8, jellyPhase);
      let stretchY = lerp(0.6, 1.3, jellyPhase);
      return {x: stretchX, y: stretchY};
      
    } else {
      jellyPhase = (recovery - 0.7) / 0.3;
      let finalX = lerp(0.8, 1.0, jellyPhase);
      let finalY = lerp(1.3, 1.0, jellyPhase);
      
      if (recovery >= 1.0) this.collisionForce = 0;
      return {x: finalX, y: finalY};
    }
  }
  
  drawStar(radius) {
    beginShape();
    for (let i = 0; i < this.points * 2; i++) {
      let r = (i % 2 === 0) ? radius : this.innerRadius * (radius / this.r);
      let angle = TWO_PI / (this.points * 2) * i - PI/2;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  checkDone() {
    let speed = Math.sqrt(this.body.velocity.x ** 2 + this.body.velocity.y ** 2);
    if (speed > 3) {
      this.lastCollisionTime = millis();
      this.collisionForce = constrain(speed / 4, 0.5, 2.0);
    }
    
    let pos = this.body.position;
    if (pos.y > height + this.r * 2 || pos.x < -this.r * 2 || pos.x > width + this.r * 2 || pos.y < -height) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
  
  toss() {
    let force = Vector.create(random(-0.03, 0.03), random(-0.08, -0.04));
    Body.applyForce(this.body, this.body.position, force);
  }
  
  removeCircle() {
    Composite.remove(engine.world, this.body);
  }
} 