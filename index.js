let expandimg_fakeimg;
let expandimg_showing_image = false;

function expandimg(image) {
	const width = image.offsetWidth,
		height = image.offsetHeight,
		ratio = width / height,
		v_width = document.documentElement.clientWidth,
		v_height = document.documentElement.clientHeight,
		v_ratio = v_width / v_height;

	const { x, y, h, w } = image.getBoundingClientRect();

	let extend_width;

	if (ratio > 1 && v_ratio > 1) {
		// Landscape pic and landscape viewport
		extend_width = ratio > v_ratio;
	} else if (ratio > 1 && v_ratio <= 1) {
		// Landscape pic and portrait viewport
		extend_width = true;
	} else if (ratio <= 1 && v_ratio > 1) {
		// Portrait pic and landscape viewport
		extend_width = false;
	} else {
		// Portrait pic and portrait viewport
		extend_width = !(ratio > v_ratio);
	}

	let scale, offset_y;

	if (extend_width) {
		const dest_width = 0.95 * v_width,
			scale_w = dest_width / width,
			dest_height = scale_w * height,
			center_y = y + height / 2,
			after_scale_y = center_y - dest_height / 2,
			dest_y = (v_height - dest_height) / 2;

		scale = scale_w;
		offset_y = (dest_y - after_scale_y) / scale_w;
	} else {
		const dest_height = 0.95 * v_height,
			scale_h = dest_height / height,
			center_y = y + height / 2,
			after_scale_y = center_y - dest_height / 2,
			dest_y = (v_height - dest_height) / 2;

		scale = scale_h;
		offset_y = (dest_y - after_scale_y) / scale_h;
	}

	expandimg_fakeimg = image.cloneNode(true);
	expandimg_fakeimg.id = 'expandimg_fake';
	expandimg_fakeimg.style.display = 'block';
	expandimg_fakeimg.style.position = 'fixed';
	expandimg_fakeimg.style.top = y + 'px';
	expandimg_fakeimg.style.left = x + 'px';
	expandimg_fakeimg.style.width = width + 'px';
	expandimg_fakeimg.style.height = height + 'px';
	expandimg_fakeimg.style.transition = 'all 250ms ease-in-out';

	document.getElementsByTagName('body')[0].appendChild(expandimg_fakeimg);
	expandimg_fakeimg.classList.add('expanded');

	setTimeout(() => {
		expandimg_fakeimg.style.transform = `scale(${scale}) translateY(${offset_y}px)`;
	}, 15);

	// document.getElementsByTagName('html')[0].style.overflow = 'hidden';
	// document.getElementsByTagName('body')[0].style.overflow = 'hidden';
}

function unexpandimg(image) {
	if (expandimg_fakeimg) {
		expandimg_fakeimg.style.transform = 'none';

		setTimeout(() => {
			expandimg_fakeimg.classList.remove('expanded');
		}, 250);

		setTimeout(() => {
			expandimg_fakeimg.parentNode.removeChild(expandimg_fakeimg);
			expandimg_fakeimg = undefined;
		}, 500);
	}
	// document.getElementsByTagName('html')[0].style.overflow = 'auto';
	// document.getElementsByTagName('body')[0].style.overflow = 'auto';
}

document.getElementsByTagName('html')[0].onclick = event => {
	if (expandimg_showing_image) {
		event.preventDefault();
		const img = document.getElementById('expandimg_fake');
		unexpandimg(img);
		expandimg_showing_image = false;
	} else if (event.target.tagName === 'IMG') {
		const img = event.target;
		!img.classList.contains('expanded') ? expandimg(img) : unexpandimg(img);
		expandimg_showing_image = true;
	}
};

document.getElementsByTagName('img').foreach(img => {
	img.style;
});
