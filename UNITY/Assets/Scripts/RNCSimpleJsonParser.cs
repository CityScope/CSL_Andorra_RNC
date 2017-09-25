using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using System.Linq;
using SimpleJSON;
using UnityEngine.UI;

public class RNCSimpleJsonParser : MonoBehaviour
{
    [Header("RNC data")]
    public TextAsset _jsonFile;
    private JSONNode _parsedJson;
    public Dictionary<int, GameObject> _dictNameObj = new Dictionary<int, GameObject>();
    [Header("Visulizing")]
    [Range(0.001f, 0.1f)]
    public float _objScale = 0.025f;
    public bool _showUnc = false;
    public Slider _24hrSlider;
    public Material _baseMaterial;

    [Header("GL Lines")]
    public Material _glLineMat;

    void Start()
    {
        _parsedJson = JSON.Parse(_jsonFile.text);
        RncAgents();
    }
    void RncAgents()
    {
        for (int _hr = 0; _hr < 23; _hr++)
        {
            for (int i = 0; i < _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["personId"].Count; i++)
            {
                float _lat = _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["lat"][i];
                float _lon = _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["lon"][i];
                int _pid = _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["personId"][i];

                if (_dictNameObj == null || _dictNameObj.ContainsKey(_pid) != true) // new object 
                {
                    var _newClObj = GameObject.CreatePrimitive(PrimitiveType.Sphere); //make obj
                    _newClObj.transform.parent = transform;
                    //float _tmpColor = (float)(1.0f / _parsedJson["dates"]["2016-08-20"]["hours"][hr]["C"]["Cid"][i]); //must use 1.0f to float
                    _newClObj.transform.GetComponent<Renderer>().material = _baseMaterial;
                    _newClObj.transform.GetComponent<Renderer>().material.color = Color.gray; // Color.HSVToRGB(_tmpColor, 1, 1);
                    _newClObj.transform.localScale = new Vector3(_objScale, _objScale, _objScale);
                    _newClObj.transform.localPosition = new Vector3((_lat - 40) * 1000, _hr, _lon * 1000); //compensate for scale shift due to height  
                    _newClObj.name = _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["personId"][i].ToString();
                    _dictNameObj.Add(_parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["personId"][i], _newClObj);
                }
                else if ((_dictNameObj != null && _dictNameObj.ContainsKey(_pid))) //obj already exist 
                {
                    //GameObject _exClObj = (_dictNameObj[_pid]); // get the GO that matches the _pid
                    var _exClObj = GameObject.CreatePrimitive(PrimitiveType.Sphere); //make obj again 
                    _exClObj.transform.parent = transform;
                    float _tmpCol = (1.0f * _hr) / 24;
                    _exClObj.transform.GetComponent<Renderer>().material = _baseMaterial;
                    _exClObj.transform.GetComponent<Renderer>().material.color = Color.Lerp(Color.green, Color.red, _tmpCol);
                    _exClObj.transform.localScale = new Vector3(2 * _objScale, 2 * _objScale, 2 * _objScale);
                    _exClObj.transform.localPosition = new Vector3((_lat - 40) * 1000, _hr, _lon * 1000);
                    _exClObj.transform.parent = transform;
                    _exClObj.name = _parsedJson["dates"]["2016-08-20"]["hours"][_hr]["C"]["personId"][i].ToString();

                }
            }
        }
    }


    void DrawUNC(int _hour)
    {
        for (int i = 0; i < _parsedJson["dates"]["2016-08-20"]["hours"][_hour]["unC"]["lon"].Count; i++)
        {
            float _lat = _parsedJson["dates"]["2016-08-20"]["hours"][_hour]["unC"]["lat"][i];
            float _lon = _parsedJson["dates"]["2016-08-20"]["hours"][_hour]["unC"]["lon"][i];
            Vector3 _startLine = new Vector3((_lat - 40) * 1000, _hour, _lon * 1000);
            GL.Begin(GL.LINES);
            _glLineMat.SetPass(0);
            GL.Vertex3(_startLine.x, _startLine.y, _startLine.z);
            GL.Vertex3(_startLine.x, _startLine.y + 0.025f, _startLine.z);
            GL.End();
        }
    }
    public void BeenClicked()
    {
        _showUnc = !_showUnc;
    }
    public void OnRenderObject()
    {
        if (_showUnc)
        {
            DrawUNC(Mathf.RoundToInt(_24hrSlider.value));
        }
    }
}