import { useState } from "react";
import VideoInput from "./components/VideoInput";
import TextPostPreview from "./components/TextPostPreview";
import CarouselPreview from "./components/CarouselPreview";
import {
  generateTextPost,
  generateCarouselSlides,
} from "./lib/rewriteEngine";

function App() {
  const [transcript, setTranscript] = useState("");
  const [textPosts, setTextPosts] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  function handleConvert(rawTranscript) {
    setIsConverting(true);
    setTranscript(rawTranscript);

    // Small delay for visual feedback
    setTimeout(() => {
      // Generate 3 text post alternatives
      const posts = [0, 1, 2].map((v) =>
        generateTextPost(rawTranscript, v)
      );
      setTextPosts(posts);

      // Generate 3 carousel alternatives
      const carouselSets = [0, 1, 2].map((v) =>
        generateCarouselSlides(rawTranscript, v)
      );
      setCarousels(carouselSets);

      setIsConverting(false);
      setHasResults(true);
    }, 800);
  }

  function handleReset() {
    setTranscript("");
    setTextPosts([]);
    setCarousels([]);
    setHasResults(false);
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
              R2L
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-tight">
                Reels to LinkedIn
              </h1>
              <p className="text-xs text-gray-500">
                by Joshua Kite
              </p>
            </div>
          </div>
          {hasResults && (
            <button
              onClick={handleReset}
              className="text-sm px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!hasResults ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4 py-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Turn your IG Reels into
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  LinkedIn content that converts
                </span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                Upload a reel or paste your transcript. Get 3 text posts and 3
                carousel alternatives — optimized for energy, health, and
                longevity coaching.
              </p>
            </div>

            {/* Input */}
            <div className="max-w-2xl mx-auto">
              <VideoInput onTranscriptReady={handleConvert} />
            </div>

            {/* Example section */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Example Transformation
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-medium text-pink-400">
                      IG Reel
                    </span>
                    <p className="text-sm text-gray-300">
                      "Quick smoothie recipe — spinach, banana, almond butter,
                      and some seeds for energy..."
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-medium text-emerald-400">
                      LinkedIn Post
                    </span>
                    <p className="text-sm text-gray-300">
                      "The smoothie that took my busy exec client from relying
                      on 6 coffees to stable energy all day without caffeine."
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleConvert(
                      "Today I'm going to show you my favorite quick smoothie recipe that gives me energy all day long. First, grab a handful of spinach, add a ripe banana, two tablespoons of almond butter, a scoop of protein powder, and some chia seeds. Blend it with almond milk. This smoothie is packed with nutrients that keep your blood sugar stable so you don't crash mid-afternoon. I drink this every morning and it's replaced my coffee habit completely. The healthy fats from the almond butter keep you full, and the chia seeds give you sustained energy. Try it for a week and you'll notice the difference in your focus and energy levels."
                    )
                  }
                  className="w-full py-2 text-sm text-emerald-400 border border-emerald-800 rounded-lg hover:bg-emerald-900/20 transition-colors cursor-pointer"
                >
                  Try this example
                </button>
              </div>
            </div>

            {/* Converting overlay */}
            {isConverting && (
              <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-lg text-white font-medium">
                    Converting to LinkedIn content...
                  </p>
                  <p className="text-sm text-gray-400">
                    Generating 3 text posts + 3 carousels
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Source transcript */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Source Transcript
                </span>
                <button
                  onClick={() => {
                    setHasResults(false);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm text-gray-400 line-clamp-3">
                {transcript}
              </p>
            </div>

            {/* Results grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              <TextPostPreview posts={textPosts} />
              <CarouselPreview carousels={carousels} />
            </div>

            {/* Regenerate */}
            <div className="text-center">
              <button
                onClick={() => handleConvert(transcript)}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                Regenerate All
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          Reels to LinkedIn by Joshua Kite — Health & Longevity Coach
        </div>
      </footer>
    </div>
  );
}

export default App;
