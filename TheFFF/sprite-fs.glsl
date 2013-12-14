#ifdef GL_ES
	precision highp float;
#endif

varying vec4 vVertexColor;
varying vec2 vVertexUV;
uniform sampler2D uTexture;

void main()
{
	gl_FragColor = vVertexColor;
}