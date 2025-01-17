'use client';
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    deadLine: string;
}


export default function Dashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const { toast } = useToast();
    const [newTask, setNewTask] = useState<Omit<Task, '_id' | 'createdAt'> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showAddTaskInputs, setShowAddTaskInputs] = useState(false);

    useEffect(() => {
        if (!session) {
            router.push("/sign-in");
        } else {
            fetchTasks();
        }
    }, [session, router]);

    const fetchTasks = async () => {
        try {
            const result = await axios.get("/api/tasks");
            if (result.data.length === 0) {
                toast({
                    title: "No task found",
                    description: "Add some tasks today 😊",
                    variant: "destructive",
                });
            }
            setTasks(result.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Error fetching tasks")
        }
    };

    const handleUpdateTask = async (updatedTask: Task) => {
        try {
            await axios.put(`/api/tasks/${updatedTask._id}`, updatedTask);
            setTasks((tasks) =>
                tasks.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
            setEditingTask(null);
            setError(null);
        } catch (error) {
            console.error("Error updating task:", error);
            setError("Error updating task")
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setTasks((tasks) => tasks.filter((task) => task._id !== taskId));
            setError(null);
        } catch (error) {
            console.error("Error deleting task:", error);
            setError("Error deleting task")
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
            setTasks((tasks) =>
                tasks.map((task) =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );
            setError(null);
        } catch (error) {
            console.error("Error updating task status:", error);
            setError("Error updating task status")
        }
    };

    const handleAddTask = async () => {
        if (!newTask) return;
        try {
            const res = await axios.post('/api/tasks', newTask);
            setTasks([...tasks, res.data.task]);
            setNewTask(null);
            setShowAddTaskInputs(false);
            setError(null);
        } catch (err: any) {
            console.error("Error adding task:", err);
            setError(err.message || "Error adding tasks");
        }
    };

    if (!session) {
        return <div>Loading...</div>;
    }

    return (
        <div className="text-white lg:mx-40 sm:mx-12 h-dvh">
            <div >
                <h1 className="font-extrabold text-3xl">
                    Welcome, {session.user?.name}!
                </h1>
            </div>
            <div>
                <hr className="w-full h-3 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-2xl">Tasks: {tasks.length}</h1>
                <Table>
                    <TableCaption>A list of your tasks.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell className="font-medium">
                                    {editingTask?._id === task._id ? (
                                        <Input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} />
                                    ) : (
                                        task.title
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingTask?._id === task._id ? (
                                        <Input type="text" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} />
                                    ) : (
                                        task.description
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingTask?._id === task._id ? (
                                        <Select onValueChange={(value)=> setEditingTask({...editingTask, status:value})}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={editingTask.status} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        task.status
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingTask?._id === task._id ? (
                                        <Input type="date" value={editingTask.deadLine} onChange={(e) => setEditingTask({ ...editingTask, deadLine: e.target.value })} />
                                    ) : (
                                        task.deadLine
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {editingTask?._id === task._id ? (
                                        <>
                                            <Button size="sm" onClick={() => handleUpdateTask(editingTask)}>Save</Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" onClick={() => setEditingTask(task)}>Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div>
                <Button onClick={() => setShowAddTaskInputs(!showAddTaskInputs)}>
                {showAddTaskInputs ? "Hide Add Task" : "Add New Task"}
            </Button>
            {showAddTaskInputs && (
                <div>
                    <Input
                        type="text"
                        placeholder="Title"
                        value={newTask?.title || ''}
                        onChange={(e) => setNewTask({ ...newTask || {}, title: e.target.value })}
                    />
                    <Input
                        type="text"
                        placeholder="Description"
                        value={newTask?.description || ''}
                        onChange={(e) => setNewTask({ ...newTask || {}, description: e.target.value })}
                    />
                    <Input
                        type="date"
                        placeholder="Deadline"
                        value={newTask?.deadLine || ''}
                        onChange={(e) => setNewTask({ ...newTask || {}, deadLine: e.target.value })}
                    />
                    <Select onValueChange={(value) => setNewTask({ ...newTask || {}, status: value })}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddTask}>Add Task</Button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            )}
                </div>
            </div>
        </div>
    );
}