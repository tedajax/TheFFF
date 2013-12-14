attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexUV;

uniform mat4 uWorld;
uniform mat4 uView;
uniform mat4 uProjection;

void main()
{
	mat4 modelView = uView * uModel;
		
	vVertexColor = aVertexColor;
	vVertexUV = aVertexUV;

	gl_Position = uProjection * modelView * vec4(aVertexPosition, 1.0);
}