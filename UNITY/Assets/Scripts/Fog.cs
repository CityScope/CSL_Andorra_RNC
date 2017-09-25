using UnityEngine;
using System.Collections;
[ExecuteInEditMode]
public class Fog : MonoBehaviour
{
    public bool fog;
    public Color fogColor;
    public float fogDensity;
    public FogModes fogMode;
    //public Color ambientLight;
    //public float haloStrength;
    //public float flareStrength;

    bool previousFog;
    Color previousFogColor;
    float previousFogDensity;
    FogModes previousFogMode;
    //Color previousAmbientLight;
    //float previousHaloStrength;
    //float previousFlareStrength;

    void OnPreRender()
    {
        previousFog = RenderSettings.fog;
        previousFogColor = RenderSettings.fogColor;
        previousFogDensity = RenderSettings.fogDensity;
        switch (RenderSettings.fogMode)
        {
            case FogMode.Exponential: previousFogMode = FogModes.Exponential; break;
            case FogMode.ExponentialSquared: previousFogMode = FogModes.ExponentialSquared; break;
            case FogMode.Linear: previousFogMode = FogModes.Linear; break;
        }
        //previousAmbientLight = RenderSettings.ambientLight;
        //previousHaloStrength = RenderSettings.haloStrength;
        //previousFlareStrength = RenderSettings.flareStrength;
        if (fog)
        {
            RenderSettings.fog = fog;
            RenderSettings.fogColor = fogColor;
            RenderSettings.fogDensity = fogDensity;
            switch (fogMode)
            {
                case FogModes.Exponential: RenderSettings.fogMode = FogMode.Exponential; break;
                case FogModes.ExponentialSquared: RenderSettings.fogMode = FogMode.ExponentialSquared; break;
                case FogModes.Linear: RenderSettings.fogMode = FogMode.Linear; break;
            }
            //RenderSettings.ambientLight = ambientLight;
            //RenderSettings.haloStrength = haloStrength;
            //RenderSettings.flareStrength = flareStrength;
        }
    }

    void OnPostRender()
    {
        RenderSettings.fog = previousFog;
        RenderSettings.fogColor = previousFogColor;
        RenderSettings.fogDensity = previousFogDensity;
        switch (previousFogMode)
        {
            case FogModes.Exponential: RenderSettings.fogMode = FogMode.Exponential; break;
            case FogModes.ExponentialSquared: RenderSettings.fogMode = FogMode.ExponentialSquared; break;
            case FogModes.Linear: RenderSettings.fogMode = FogMode.Linear; break;
        }
        //RenderSettings.ambientLight = previousAmbientLight;
        //RenderSettings.haloStrength = previousHaloStrength;
        //RenderSettings.flareStrength = previousFlareStrength;
    }

    public enum FogModes
    {
        Exponential,
        ExponentialSquared,
        Linear
    }
}