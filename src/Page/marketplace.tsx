import StoryCard from "../components/Storycard";

const storyCards = [
  {
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
    title: "Tales from the Savanna",
    summary:
      "An intimate collection of stories passed down through generations, capturing the essence of life on the African plains.",
    price: "$56.67",
  },
  {
    image:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&q=80",
    title: "Wisdom of the Elders",
    summary:
      "Timeless proverbs and folklore that offer guidance, inspiration, and insight into traditional ways of living.",
    price: "$42.50",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    title: "Journey to the Highlands",
    summary:
      "Adventure narratives from explorers who traversed rugged terrain to document rare cultural practices.",
    price: "$68.90",
  },
];

export default function Marketplace() {
  return (
    <section className="container mx-auto px-6 py-16 bg-stone-200/30 rounded-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-3">
          Story Marketplace
        </h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {storyCards.map((card, index) => (
          <StoryCard key={index} {...card} />
        ))}
      </div>
    </section>
  );
}
