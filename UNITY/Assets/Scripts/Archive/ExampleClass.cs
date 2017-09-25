using UnityEngine;

public class ExampleClass : MonoBehaviour
{
    static Material lineMaterial;
    static void CreateLineMaterial()
    {
        if (!lineMaterial)
        {
            Shader shader = Shader.Find("Hidden/Internal-Colored");
            lineMaterial = new Material(shader);
        }
    }
    public void OnRenderObject()
    {
        CreateLineMaterial();
        lineMaterial.SetPass(0);
        GL.PushMatrix();
        GL.MultMatrix(transform.localToWorldMatrix);
        GL.Begin(GL.LINES);
        for (int i = 0; i < 10000; i++)
        {
            GL.Color(Color.yellow);
            GL.Vertex3(i, 0, 0);
            GL.Vertex3(0, i, 0);
            GL.Vertex3(0, 0, i);
        }
        GL.End();
        GL.PopMatrix();
    }
}


/*


            for (int i = 0; i < _parsedJson["dates"]["2016-08-20"]["hours"][hr]["unC"]["lon"].Count; i++)
            {
                float _lat = _parsedJson["dates"]["2016-08-20"]["hours"][hr]["unC"]["lat"][i];
                float _lon = _parsedJson["dates"]["2016-08-20"]["hours"][hr]["unC"]["lon"][i];
                int _cid = _parsedJson["dates"]["2016-08-20"]["hours"][hr]["C"]["Cid"][i];
                x = _lat - 40;
                y = hr;
                z = _lon * 1000;
            }


    static void CreateLineMaterial()
    {
        if (!lineMaterial)
        {
            Shader shader = Shader.Find("Hidden/Internal-Colored");
            lineMaterial = new Material(shader);
        }
    }
    public void OnRenderObject()
    {
        DrawLines(x, y, z);
    }
    void DrawLines(float x, float y, float z)
    {
        CreateLineMaterial();
        lineMaterial.SetPass(0);
        GL.PushMatrix();
        GL.MultMatrix(transform.localToWorldMatrix);
        GL.Begin(GL.LINES);
        GL.Color(Color.red);
        GL.Vertex3(x, y, z);
        GL.End();
        GL.PopMatrix();
    }
}



animate cluster:

create 1st layer,
store obj + name in list 
go to next next hour 
if name exist there, move object there 
if not - make new object and add to list + name 

*/
