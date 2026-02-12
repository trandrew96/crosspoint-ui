import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

interface GameData {
  id: number;
  name: string;
  rating: number;
  coverUrl: string;
  storyline: string;
  summary: string;
  platforms: Array<string>;
  genres: Array<string>;
  screenshots: Array<string>;
}

function GameItem() {
  const [data, setData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINT = "http://localhost:8080/api/games/" + useParams().id;

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
        console.log("response:", data);
        console.log("Fetch attempt finished.");
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Nav />
      {/* <div>GameItem {id}</div> */}

      {!loading && !error && data && (
        <main className="max-w-7xl mx-auto text-center mt-10">
          <img
            className="h-64 object-cover rounded-lg mx-auto"
            src={data?.coverUrl}
            alt={data?.name}
            width={200}
          />
          <h1 className="text-2xl font-bold">{data?.name}</h1>
          <p> {data?.storyline || data?.summary}</p>
          <div className="grid grid-cols-2 max-w-xl mx-auto gap-10">
            <div>
              <h2 className="text-xl font-bold mt-10">Platforms</h2>
              <ul>
                {data?.platforms?.map((platform) => (
                  <li key={platform}>{platform}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mt-10">Genres</h2>
              <ul>
                {data?.genres?.map((platform) => (
                  <li key={platform}>{platform}</li>
                ))}
              </ul>
            </div>
          </div>
          <section className="grid grid-cols-6">
            {data?.screenshots?.map((screenshotUrl, index) => (
              <img
                key={index}
                className="h-32 object-cover mx-auto"
                src={screenshotUrl}
                alt={`Screenshot ${index + 1}`}
              />
            ))}
          </section>
          <div className="w-20">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </main>
      )}

      <Footer />
    </>
  );
}

export default GameItem;
