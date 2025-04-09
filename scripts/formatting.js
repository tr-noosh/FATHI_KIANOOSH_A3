/** @type {CSSStyleSheet} */
var sheet = document.querySelector(`link[href='styles/formattingpage.css']`).sheet;
var gradient_names = document.createElement('div');
/** @type {TextAnim[]} */
var ani_list = [];
var anim_count = 0;

class TextAnim {
	constructor(animname, default_duration, default_chardelay, default_timefunc, default_iterations, default_direction, padx, pady) {
		this.name = animname;
		this.anim_name = animname + '-anim';
		this.class_name = 'cool-' + animname;
		this.duration = default_duration;
		this.chardelay = default_chardelay;
		this.timefunc = default_timefunc;
		this.iteration = default_iterations;
		this.direction = default_direction;
		this.x_pad = padx;
		this.y_pad = pady;
	}
	putDefaults(attrs) {
		return [
			(attrs[0] ? attrs[0] : this.duration),
			(attrs[1] ? parseFloat(attrs[1])*-1 : this.chardelay),
			(attrs[2] ? attrs[2] : this.timefunc),
			(attrs[3] ? attrs[3] : this.iteration),
			// start delay?
			(attrs[4] ? attrs[4] : this.direction),
			// fill-mode? play-state? composition?
			this.x_pad, this.y_pad
		];
	}
}

ani_list.push(new TextAnim('swirl','.65s', -20, 'linear', 'infinite', 'normal', .3, .3));
ani_list.push(new TextAnim('shake', '.3333s', 'randy', 'step-end', 'infinite', 'normal', .1, .1));
ani_list.push(new TextAnim('rainbow', '3.25s', -2, 'linear', 'infinite', 'normal', 0, 0));
ani_list.push(new TextAnim('wave', '1s', -32, 'cubic-bezier(0.3642, 0, 0.6358, 1)', 'infinite', 'normal', 0, .2));
ani_list.push(new TextAnim('pulse', '.5s', -28, 'cubic-bezier(.5,0,.5,1)', 'infinite', 'alternate', .2, .4));


class CoolFormattingElement extends HTMLElement
{
	// static observedAttributes = ['b', 'swirl', 'shake', 'rainbow', 'wave', 'pulse']; // for attributeChangedCallback()
	constructor() {
		super();
	}
	connectedCallback() { 
		if (ani_list.some(ani=>this.getAttributeNames().includes(ani.name))) {
			this._resetAnimation = true;
		}
		setTimeout(_=>{this.formatAll();});
	}
	setupChars(delays) {
		this.chars = [];
		let skipping = false, combinating = false, ccount = 0;
		let inhtml = this.innerHTML;
		this.innerHTML = "";
		[...inhtml].forEach((c, i) => {
			if (c == "<") { skipping = true; return; }
			if (c == ">") { skipping = false; return; }
			if (c == "&") { combinating = true; ccount = 1; return; }
			// figure out way to put seperate words in spans with "white-space: nowrap" on them or something
			// so that you can have word wrapping on formatted text without making the letters break apart
			if (combinating) {
				if (c == ";") {
					combinating = false; ccount += 1;
					let piece = /** @type {HTMLSpanElement} */ (document.createElement('span'));
					piece.innerHTML = inhtml.substring((i) - ccount, i);
					let dstring = "animation-delay:";
					delays.forEach(d => { 
						if (d == 'randy') { dstring += `-${Math.random()}s,`; }
						else { dstring += `${d * i}ms,`; }
					});
					dstring = dstring.substring(0, dstring.length - 1);
					dstring += ';';
					piece.style.cssText = dstring;
					this.chars.push(piece);
					this.appendChild(piece);
				} else { ccount += 1; }
				return;
			}
			if (skipping) { return; }
			let piece = /** @type {HTMLSpanElement} */ (document.createElement('span'));
			piece.innerHTML = inhtml.substring(i, i + 1);
			let dstring = "animation-delay: ";
			delays.forEach(d => {
				if (d == 'randy') { dstring += `-${Math.random()}s,`; }
				else { dstring += `${d * i}ms,`; }
			});
			dstring = dstring.substring(0, dstring.length - 1);
			dstring += ';';
			piece.style.cssText = dstring;
			this.chars.push(piece);
			this.appendChild(piece);
		});

	}
	formatAll() {
		/// STATIC FORMATTING
		this.classList.toggle('cool-bold', this.hasAttribute('b'));
		
		// GRADIENTS
		if (this.hasAttribute('grad')) {
			let grargs = this.getAttribute('grad').split('/');
			let colors = [];
			grargs = grargs.filter(arg => {
				if (!arg.startsWith("!") && !arg.startsWith('#')) {return true;}
				colors.push((arg.startsWith('!') ? arg.substring(1) : arg));
				return false;
			});
			let type = (grargs.at(0) ? grargs.at(0) : 'lg');
			let ang = (grargs.at(1) ? grargs.at(1) : '.5turn');
			let interp = (grargs.at(2) ? grargs.at(2) : 'oklab');
			if (colors.length < 1) { colors = ['#9198e5','#e66465'];}
			let lg_name = `${type}${ang}${interp}${colors.join('')}`;
			lg_name = lg_name.replace(/[^a-zA-Z0-9]/g, ''); // is the regex worth it....
			if (!gradient_names.classList.contains(`cool-grad-${lg_name}`)) {
				let typefull = "linear-gradient";
				if (type == "rg") {typefull = "radial-gradient";}
				if (type == "cg") {typefull = "conic-gradient"; ang = `from ${ang}`}
				let colorfull = colors.join(',');

				let gradient_rule = `.cool-grad-${lg_name} { background-image: ${typefull}(${ang} in ${interp}, ${colorfull});}`;
				sheet.insertRule(gradient_rule);
				gradient_names.classList.add(`cool-grad-${lg_name}`);	
			}
			this.classList.add(`cool-grad-${lg_name}`);
			this.classList.add(`cool-gradient`);
		}

		/// ANIMATIONS
		if (this._resetAnimation) {
			this._resetAnimation = false;
			
			// COLLECTIVE ANIMATIONS

			// PER CHARACTER ANIMATIONS
			let names = [];
			let durations = [];
			let chardelays = [];
			let timefuncs = [];
			let iterations = [];
			let directions = [];

			let padx = 0;
			let pady = 0;

			for (const char_anim of ani_list) {
				if (this.hasAttribute(char_anim.name)) {
					let args = char_anim.putDefaults(this.getAttribute(char_anim.name).split('/'));
					console.log(args);
					names.push(char_anim.anim_name);
					durations.push(args[0]);
					chardelays.push(args[1]);
					timefuncs.push(args[2]);
					iterations.push(args[3]);
					directions.push(args[4]);
					padx += args[5];
					pady += args[6];
				}
				this.classList.toggle(char_anim.class_name, this.hasAttribute(char_anim.name));
			}

			if (this.hasAttribute('grad')) {
				this.style.padding = `${pady}em ${padx*1.25}em`; // TEST for increased spacing for legibility
				this.style.margin = `-${pady}em -${padx}em`; 
			} else {
				this.style.paddingLeft = `${padx*0.25}em`; this.style.paddingRight = `${padx*0.25}em`;
			}

			let cool_rule = `
				.cool-anim-${anim_count} span {
					animation-name: ${names.join(',')};
					animation-duration: ${durations.join(',') };
					animation-timing-function: ${timefuncs.join(',') };
					animation-iteration-count: ${iterations.join(',') };
					animation-direction: ${directions.join(',') };
			}`;
			/// TODO: dont make a new css tag every time. figure out some kind of signature-based technique (like with gradients? or better method)
			sheet.insertRule(cool_rule);
			//if (!Object.hasOwn(this, 'chars')) {	// support updating formatting properties
				this.setupChars(chardelays);
			//} else { this.updateChars(chardelays);}
			this.classList.add(`cool-anim-${anim_count}`);
			anim_count++;
		}
	}
}


customElements.define("f-", CoolFormattingElement);