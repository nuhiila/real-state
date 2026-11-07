export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FAF8F4]">
      <div className="h-20 bg-[#14213D]" />
      <div className="mx-auto max-w-[1280px] animate-pulse px-5 py-16 md:px-10">
        <div className="h-12 w-2/3 bg-[#E9DCC3]" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item}>
              <div className="aspect-[4/3] rounded-[22px] bg-[#E9DCC3]" />
              <div className="mt-5 h-6 bg-[#E9DCC3]/70" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
