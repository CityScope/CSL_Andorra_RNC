using System.Collections;
using System.Collections.Generic;
using UnityEngine;


[System.Serializable]
public class UnCl
{
    public List<double> lon;
    public List<double> lat;
}
[System.Serializable]
public class Cl
{
    public List<object> nation;
    public List<int> personId;
    public List<int> Cid;
    public List<double> lon;
    public List<double> lat;
}
[System.Serializable]
public class ThisHour
{
    public UnCl unCl;
    public Cl cl;
}
[System.Serializable]
public class Hours
{
    public ThisHour thisHour;
}
[System.Serializable]
public class ThisDate 
{
    public Hours hours;
}
[System.Serializable]
public class Dates
{
    public ThisDate thisDate;
}
[System.Serializable]
public class RncJsonRoot
{
    public Dates dates;

    public static RncJsonRoot CreateFromJSON(string jsonString)
    {
        return JsonUtility.FromJson<RncJsonRoot>(jsonString);
    }
}

public class RncJsonPareser : MonoBehaviour
{
    public TextAsset _jsonFile;
    public RncJsonRoot _rncRoot;


    // Use this for initialization
    void Start()
    {
        _rncRoot = RncJsonRoot.CreateFromJSON(_jsonFile.text);
        print(_rncRoot.dates.thisDate.hours.thisHour.unCl.lat.Count);
    }

}
