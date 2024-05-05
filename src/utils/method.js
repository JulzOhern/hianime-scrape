export function retrieveServerId($, index, category) {
  return (
    $(`.ps_-block.ps_-block-sub.servers-${category} > .ps__-list .server-item`)
      ?.map((_, el) =>
        $(el).attr("data-server-id") == `${index}` ? $(el) : null
      )
      ?.get()[0]
      ?.attr("data-id") || null
  );
}
