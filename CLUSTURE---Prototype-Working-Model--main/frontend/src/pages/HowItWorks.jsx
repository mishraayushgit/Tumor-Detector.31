import { Link } from 'react-router-dom'
import { Upload, Eye, Cpu, CheckCircle, ShieldAlert, ArrowRight, Layers, Sliders, Database, Activity } from 'lucide-react'
import Footer from '../components/Footer'

function StepDetailCard({ step, title, subtitle, icon: Icon, bullets, codeSnippet, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
            <Icon size={26} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-plum">Phase {step}</span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h3>
          </div>
        </div>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium self-start sm:self-auto">
          {subtitle}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Technical Operations:</h4>
          <ul className="space-y-2.5 text-sm text-gray-600">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {codeSnippet && (
          <div className="bg-ink text-mint/90 p-4 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto border border-white/10">
            <div className="text-white/40 text-[10px] mb-2">// Pipeline execution snippet</div>
            <pre className="text-gray-200">{codeSnippet}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      {/* Hero header */}
      <div className="bg-plum text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-mint/20 text-mint text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Architectural Pipeline & Step-by-Step Execution
          </span>
          <h1 className="font-medium text-4xl sm:text-5xl mb-4">How Tumor Detector.31 Works</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            From raw DICOM/MRI scan upload to ResNet50 residual feature propagation and probabilistic diagnosis inference.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-10">

        {/* High level visual diagram */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">End-to-End Processing Flow</h2>
          <p className="text-gray-500 text-sm mb-6">
            Real-time inference cycle running across Vite React Client, Flask REST Gateway, and TensorFlow Graph.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            {[
              { num: '01', title: 'MRI Ingestion', desc: 'Drag-and-drop client validation & sanitization' },
              { num: '02', title: 'Preprocessing', desc: 'Bicubic 224x224 resize & [0,1] normalization' },
              { num: '03', title: 'ResNet50 Pass', desc: 'Residual bottleneck feature extraction' },
              { num: '04', title: 'Softmax Probabilities', desc: 'Confidence scoring & triage classification' },
            ].map((st, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                <span className="w-8 h-8 rounded-full bg-plum text-mint text-xs font-bold flex items-center justify-center mb-2">
                  {st.num}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">{st.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step by step cards */}
        <div className="space-y-6">
          <StepDetailCard
            step="1"
            title="Image Upload & Client-Side Validation"
            subtitle="Browser React Layer"
            icon={Upload}
            color="bg-plum"
            bullets={[
              'Validates MIME types ensuring strict acceptance of image/jpeg, image/png, or image/webp files.',
              'Enforces file size constraints with a 10MB ceiling to prevent buffer saturations.',
              'Generates a local blob preview via URL.createObjectURL() for immediate physician inspection prior to network transmission.',
              'Packages the payload into multipart/form-data for asynchronous upload to Flask.'
            ]}
            codeSnippet={`const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/detect', {
  method: 'POST',
  body: formData
});`}
          />

          <StepDetailCard
            step="2"
            title="Server Reception & Tensor Preprocessing"
            subtitle="Flask + NumPy Pipeline"
            icon={Sliders}
            color="bg-indigo-600"
            bullets={[
              'Applies werkzeug.utils.secure_filename combined with UUID prefixes to guarantee unique filesystem isolation in /uploads.',
              'Loads raw raster channels and resizes dimensions to uniform 224 × 224 resolution matching ResNet50 input requirements.',
              'Normalizes integer pixel intensities [0, 255] into floating-point range [0.0, 1.0].',
              'Expands dimensions with an added batch axis creating shape (1, 224, 224, 3).'
            ]}
            codeSnippet={`img = load_img(image_path, target_size=(224, 224))
img_array = img_to_array(img) / 255.0
img_array = np.expand_dims(img_array, axis=0) # shape: (1, 224, 224, 3)`}
          />

          <StepDetailCard
            step="3"
            title="Deep Residual Inference (ResNet50)"
            subtitle="TensorFlow / Keras Graph"
            icon={Cpu}
            color="bg-purple-700"
            bullets={[
              'Passes the tensor through 50 convolutional layers grouped into 5 residual identity blocks.',
              'Identity shortcut connections mitigate vanishing gradients, capturing subtle structural MRI patterns.',
              'GlobalAveragePooling2D condenses the final spatial feature map into a dense 2048-dimensional vector.',
              'Evaluates dense layers with ReLU activation and Dropout regularization before Softmax normalization.'
            ]}
            codeSnippet={`prediction = model.predict(img_array, verbose=0)
predicted_index = int(np.argmax(prediction[0]))
confidence = float(np.max(prediction[0]))`}
          />

          <StepDetailCard
            step="4"
            title="Probabilistic Scoring & Triage Alert"
            subtitle="Output Dispatch"
            icon={Activity}
            color="bg-emerald-600"
            bullets={[
              'Assigns the highest logit to one of 4 ground-truth classes: Glioma, Meningioma, Pituitary, or No Tumor.',
              'Dispatches full floating-point probability distributions for clinical interpretability.',
              'Triggers an uncertainty flag if the peak confidence falls below 60%.',
              'Renders visual probability meters and immediate specialist consultation guidance.'
            ]}
            codeSnippet={`return jsonify({
  "result": "Tumor: glioma",
  "label": "glioma",
  "confidence": 0.9743,
  "probabilities": { "glioma": 0.9743, ... }
})`}
          />
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-ink to-plum text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10">
          <div>
            <h3 className="text-2xl font-bold">Ready to test the model?</h3>
            <p className="text-white/70 text-sm mt-1">Upload a cranial MRI scan and examine the real-time classification metrics.</p>
          </div>
          <Link
            to="/detect"
            className="bg-mint text-ink font-semibold px-6 py-3 rounded-full hover:bg-mint/90 transition-colors shrink-0 flex items-center gap-2"
          >
            Launch Detector <ArrowRight size={16} />
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  )
}
