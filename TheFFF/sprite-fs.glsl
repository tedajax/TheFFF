precision highp float;

varying vec4 vVertexColor;
varying vec2 vVertexUV;
uniform sampler2D uTexture;

void main()
{
    gl_FragColor = vVertexColor * texture2D(uTexture, vVertexUV);
}