export const getToday = () => {
    const now = new Date();
    const today = now
      .toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");  
    return today;
}

export const getTomorrow = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const tomorrow = now.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
    return tomorrow;
}