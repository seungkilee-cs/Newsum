function UserPreferences() {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);

  const savePreferences = async () => {
    await axios.post("/api/user_preferences", { sites, categories });
  };

  return (
    <div>
      <h2>Your Preferences</h2>
      <MultiSelect
        options={availableSites}
        value={sites}
        onChange={setSites}
        labelledBy="Select preferred sites"
      />
      <MultiSelect
        options={availableCategories}
        value={categories}
        onChange={setCategories}
        labelledBy="Select preferred categories"
      />
      <button onClick={savePreferences}>Save Preferences</button>
    </div>
  );
}
