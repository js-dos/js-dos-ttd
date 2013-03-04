var PutImageRender = function (image1, image2) {
	this.canvas = document.getElementById('canvas');
	this.context = this.canvas.getContext('2d');
	this.context.imageSmoothingEnabled = true;
	this.image = this.context.createImageData(1024, 768);
	this.data = this.image.data;
	
	this.image1 = image1;
	this.image2 = image2;
	this.cycle = 0;

	this.render = function () {
		var buffer = this.image1;
		if (this.cycle % 2 == 0) {
			buffer = this.image2;
		} 

		var data = this.data;
		var size = data.length;
		
		for (var i = 0; i<size; ++i) {
			data[i] = buffer[i];
		}

		this.context.putImageData(this.image, 0, 0);
		this.cycle++;
	}
}