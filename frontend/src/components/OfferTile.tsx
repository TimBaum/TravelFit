import { IOffer } from '@models/offer'
import { Clock9 } from 'lucide-react'

function OfferTile({ offer }: { offer: IOffer }) {
  return (
    <div className="h-46 border rounded p-2 relative my-2">
      {/* Section left side */}
      <div className="flex flex-col gap-1">
        {offer.isSpecial && <SpecialOfferTile />}
        <div className="text-2xl font-bold">{offer.title}</div>
        <div className="w-4/5">{offer.description}</div>
      </div>

      {/* Section right side */}
      <div className="absolute top-2 right-2">
        {offer.isSpecial && (
          <>Valid until {new Date(offer.endDate).toLocaleDateString('de-DE')}</>
        )}
      </div>
      <div className="absolute bottom-2 right-2">Price: {offer.priceEuro}€</div>
    </div>
  )
}

function SpecialOfferTile() {
  return (
    <div className="flex w-fit gap-2 items-center px-2 py-1 border rounded">
      <Clock9 className="w-5 h-5" />
      <div>Special Offer</div>
    </div>
  )
}

export default OfferTile
