import {
	Vector2
} from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const CustomShader = {

	uniforms: {

		'tDiffuse': { value: null },
		'uTime': {value: null},
		'uProgress': {value: 0},
		'uScale': {value: 1},
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`
		uniform float uTime;
		uniform float uProgress;
		uniform float uScale;
		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {

			vec2 newUV = vUv;

			vec2 p = 2.0 * vUv - vec2(1.0);

			p += .1*cos( uScale * 2.*p.yx + uTime + vec2(1.3 , 2.4));
			p += .1*cos( uScale * 3.7*p.yx + uTime*2.3 + vec2(2.3 , 4.1));
			p += .1*cos( uScale * 4.7*p.yx + uTime*2.1 + vec2(6.3 , 1.2));
			p += .2*cos( uScale * 6.7*p.yx + uTime*1.2 + vec2(9.2 , 2.4));
			p += .2*cos( uScale * 1.7*p.yx + uTime*.2 + vec2(4.2 , 1.4));
			p += .2*cos( uScale * 1.2*p.yx + uTime*1.7 + vec2(3.2 , 6.4));

			newUV.x = mix(vUv.x, length(p)*.75, uProgress);
			newUV.y = mix(vUv.y, 0., uProgress);

			vec4 color = texture2D( tDiffuse, newUV );
			// vec4 color = texture2D( tDiffuse, vUv );

			gl_FragColor = color;
			// gl_FragColor = vec4(length(p), 0., 1., 1.);
		}`

};

export { CustomShader };
