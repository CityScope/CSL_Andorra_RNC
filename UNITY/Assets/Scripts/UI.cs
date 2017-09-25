using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
public class UI : MonoBehaviour
{

    [Header("UI Elements")]
    public Text _hourUiText;
    public Slider _24hrSlider;
    bool _showAndorraModel = true;
    [Header("Model")]
    public GameObject _andorraModel;
    public void ShowAndorraButton()
    {
        _andorraModel.SetActive(!_showAndorraModel);
        _showAndorraModel = !_showAndorraModel;
    }
    void Update()
    {
        _hourUiText.text = "at hour: " + _24hrSlider.value.ToString();

        if (_showAndorraModel)
        {
            _andorraModel.transform.position =
                new Vector3(_andorraModel.transform.position.x,
                _24hrSlider.value,
                _andorraModel.transform.position.z);
        }
    }
}
