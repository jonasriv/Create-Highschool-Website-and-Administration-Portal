import Front from "./Front"
import Header from "./Header"
import Apply from "./Apply"
import Study from "./Study"

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Header />
      <main className="h-full min-h-fit mt-4">
        <div className="flex flex-col w-full">
          <Front />
          <Study/>        
          <Apply/>
        </div>
      </main>
    </div>
  );
}
