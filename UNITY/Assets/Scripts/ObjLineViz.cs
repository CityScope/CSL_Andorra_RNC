using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Linq;
using UnityEngine.UI;
public class ObjLineViz : MonoBehaviour
{
    [Header("RNC data Gameobj")]
    public GameObject _rncGo;
    [Header("Camera")]
    public Camera _cam;
    [Header("Selection Line Viz")]
    public Material _glowMat;
    LineRenderer _lineRenderer;
    public GameObject _selectionText;
    void Start()
    {
        _lineRenderer = GetComponent<LineRenderer>();
    }
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            RaycastHit hitInfo = new RaycastHit();
            bool hit = Physics.Raycast(_cam.ScreenPointToRay(Input.mousePosition), out hitInfo);
            if (hit)
            {
                var _sameObjList = Resources.FindObjectsOfTypeAll<GameObject>().Where(obj => obj.name == hitInfo.transform.gameObject.name);
                if (_sameObjList.Count() > 1) //if this is a reapting obj in multiple clusters
                {
                    _sameObjList = _sameObjList.OrderBy(_go => _go.transform.position.y);
                    Vector3[] _objLocList = new Vector3[_sameObjList.Count()];
                    int i = 0;
                    foreach (GameObject _tmpObj in _sameObjList)
                    {
                        _tmpObj.transform.localScale = new Vector3(.15f, .15f, .15f);
                        _tmpObj.transform.GetComponent<Renderer>().material = _glowMat;
                        _objLocList[i] = _tmpObj.transform.localPosition;
                        i = i + 1;
                    }
                    //_objLocList[_sameObjList.Count()] = _selectionText.transform.position;
                    _lineRenderer.positionCount = _objLocList.Length;
                    _lineRenderer.SetPositions(_objLocList);
                }
            }
        }
    }
}
