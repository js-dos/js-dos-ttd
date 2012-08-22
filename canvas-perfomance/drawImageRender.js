var DrawImageRender = function () {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');

	this.image1 = new Image();
	this.image1.src = "image1.jpg";
	this.image2 = new Image();
	this.image2.src = "image2.jpg";
	this.cycle = 0;

	this.render = function () {
		if (this.cycle % 2 == 0) {
			this.context.drawImage(this.image1, 0, 0);
		} else {
			this.context.drawImage(this.image2, 0, 0);
		}
		this.cycle++;
	}
}