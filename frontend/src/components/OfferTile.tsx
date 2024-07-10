import { IOffer } from '@models/offer'
import { Clock9 } from 'lucide-react'

function OfferTile({ offer }: { offer: IOffer }) {
  return (
    <div className="flex h-46 w-full border rounded p-2 relative m-2">
      {/* Section left side */}
      <div className="w-2/3">
        {offer.isSpecial && <SpecialOfferTile />}
        <h1 className="mt-2 text-2xl font-bold">{offer.title}</h1>
        {offer.description}
      </div>
      {/* Section right side */}
      <div className="flex justify-between w-full ml-4 pr-2">
        <div className="ml-auto">
          {offer.isSpecial && (
            <>
              Valid until {new Date(offer.endDate).toLocaleDateString('de-DE')}
            </>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          Price: {offer.priceEuro}€
        </div>
      </div>
    </div>
  )
}

function SpecialOfferTile() {
  return (
    <div className="flex gap-2 items-center px-2 py-1 border rounded">
      <Clock9 className="w-5 h-5" />
      Special Offer
    </div>
  )
}

export default OfferTile
