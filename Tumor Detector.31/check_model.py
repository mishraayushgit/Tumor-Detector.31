import h5py
import json

MODEL_PATH = r"C:\Users\CHANDRAMANI KUMAR\PycharmProjects\Brain Tumor Detection System\models\model98_57res_97_76.h5"

with h5py.File(MODEL_PATH, "r") as f:
    print("✅ File opened successfully\n")

    print("🔹 Root attributes:")
    for key in f.attrs:
        val = f.attrs[key]
        try:
            print(f"  {key}: {val}")
        except:
            print(f"  {key}: <unprintable>")

    print("\n🔹 Model config preview:\n")

    if "model_config" in f.attrs:
        raw_cfg = f.attrs["model_config"]

        # ✅ Handle both bytes and str safely
        if isinstance(raw_cfg, bytes):
            config_str = raw_cfg.decode("utf-8")
        else:
            config_str = raw_cfg

        config = json.loads(config_str)

        print("✅ Keys in model_config:", config.keys())

        keras_version = config.get("keras_version", "❌ Not found")
        backend = config.get("backend", "❌ Not found")

        print("\n✅ Extracted Info:")
        print("Keras Version:", keras_version)
        print("Backend:", backend)
    else:
        print("❌ No model_config found in file.")
