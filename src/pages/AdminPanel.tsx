import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit3, PlusCircle, Save } from "lucide-react";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const [instructions, setInstructions] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [rules, setRules] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // 1. Security Check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "haseebswati11@gmail.com" && password === "Haseeb@Swati@12!") {
      setIsAuthorized(true);
      fetchInstructions();
    } else {
      alert("Unauthorized Access!");
    }
  };

  // 2. Fetch all instructions from Database
  const fetchInstructions = async () => {
    const { data, error } = await supabase.from('admin_instructions').select('*');
    if (!error) setInstructions(data || []);
  };

  // 3. CREATE or MODIFY
  const handleSave = async () => {
    if (!category || !rules) return alert("Please fill both fields");

    const { error } = await supabase
      .from('admin_instructions')
      .upsert({ 
        id: editingId || undefined, // If editing, use existing ID
        category_name: category, 
        grading_rules: rules 
      }, { onConflict: 'category_name' });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(editingId ? "Updated successfully!" : "Created successfully!");
      setCategory("");
      setRules("");
      setEditingId(null);
      fetchInstructions();
    }
  };

  // 4. DELETE
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this essay category?")) {
      const { error } = await supabase.from('admin_instructions').delete().eq('id', id);
      if (!error) fetchInstructions();
    }
  };

  // 5. LOAD INTO FORM TO MODIFY
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setCategory(item.category_name);
    setRules(item.grading_rules);
    window.scrollTo(0, 0);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="p-8 bg-zinc-900 rounded-xl border border-gold/20 w-full max-w-md">
          <h1 className="text-2xl font-serif text-gold mb-6 text-center">Admin Login</h1>
          <input type="email" placeholder="Email" className="w-full mb-3 p-3 bg-black border border-white/10 rounded" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full mb-6 p-3 bg-black border border-white/10 rounded" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-gold hover:bg-yellow-600 py-3 text-black font-bold rounded transition-colors">Enter Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-gold mb-8">Essay Instruction Manager</h1>
        
        {/* CREATE / EDIT SECTION */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 mb-12">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            {editingId ? <Edit3 className="text-gold" /> : <PlusCircle className="text-gold" />}
            {editingId ? "Modify Instruction" : "Create New Category"}
          </h2>
          <input 
            value={category} 
            placeholder="Essay Heading (e.g. Pakistan Affairs)" 
            className="w-full p-3 mb-4 bg-black border border-white/10 rounded text-gold"
            onChange={(e) => setCategory(e.target.value)}
          />
          <textarea 
            value={rules} 
            placeholder="AI Rules: e.g. If they mention 1947, give 5 points. Check grammar strictly."
            className="w-full p-3 h-32 mb-4 bg-black border border-white/10 rounded"
            onChange={(e) => setRules(e.target.value)}
          />
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex items-center gap-2 bg-gold px-6 py-2 text-black font-bold rounded">
              <Save size={18} /> {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button onClick={() => {setEditingId(null); setCategory(""); setRules("");}} className="px-6 py-2 border border-white/20 rounded">Cancel</button>
            )}
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="grid gap-4">
          <h2 className="text-xl text-zinc-400">Existing Categories</h2>
          {instructions.map((item) => (
            <div key={item.id} className="bg-zinc-900/50 p-4 rounded-lg border border-white/5 flex justify-between items-start group">
              <div>
                <h3 className="text-gold font-bold">{item.category_name}</h3>
                <p className="text-sm text-zinc-400 mt-1">{item.grading_rules}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(item)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;