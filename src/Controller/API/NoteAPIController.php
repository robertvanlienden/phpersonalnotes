<?php

namespace App\Controller\API;

use App\Entity\Note;
use App\Entity\Notebook;
use App\Serializer\NoteSerializer;
use App\Serializer\NotesSerializer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/v1/", name="api_notes")
 */
class NoteAPIController extends AbstractController
{
    private NoteSerializer $noteSerializer;
    private NotesSerializer $notesSerializer;

    public function __construct(NoteSerializer $noteSerializer, NotesSerializer $notesSerializer)
    {
        $this->noteSerializer = $noteSerializer;
        $this->notesSerializer = $notesSerializer;
    }

    /**
     * @Route("note/{notebook}", name="api_get_notes", methods={"GET"}, defaults={"notebook"=null})
     */
    public function index(?Notebook $notebook): Response
    {
        $user = $this->getUser();

        if (!$notebook) {
            $notes = $this->getDoctrine()->getRepository(Note::class)->findByUser($user);

            return $this->json($this->notesSerializer->serialize($notes));
        }

        $this->denyAccessUnlessGranted('view', $notebook);
        $notes = $notebook->getNotes();

        return $this->json($this->notesSerializer->serialize($notes->toArray()));
    }

    /**
     * @Route("note/{notebook}", name="api_create_note", methods={"POST"}, defaults={"notebook"=null})
     */
    public function create(Notebook $notebook, Request $request): Response
    {
        $this->denyAccessUnlessGranted('edit', $notebook);

        $note = new Note();
        $note->setTitle($request->get('title'));
        $note->setContent($request->get('content'));
        $notebook->addNote($note);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->persist($notebook);
        $entityManager->persist($note);
        $entityManager->flush();

        return $this->json($this->noteSerializer->serialize($note), Response::HTTP_CREATED);
    }

    /**
     * @Route("note/{notebook}/{note}", name="api_show_note", methods={"GET"})
     */
    public function show(Notebook $notebook, Note $note): Response
    {
        $this->denyAccessUnlessGranted('view', $note);

        return $this->json($this->noteSerializer->serialize($note));
    }

    /**
     * @Route("note/{note}", name="api_edit_note", methods={"PATCH"})
     */
    public function edit(Note $note, Request $request): Response
    {
        $entityManager = $this->getDoctrine()->getManager();

        if ($request->get('notebook')) {
            $notebook = $entityManager->getRepository(Notebook::class)->find($request->get('notebook'));

            if (!$notebook instanceof Notebook) {
                return $this->json(['message' => 'Notebook not found!'], Response::HTTP_BAD_REQUEST);
            }

            $this->denyAccessUnlessGranted('edit', $notebook);
            $note->setNotebook($notebook);
        }

        $note->setTitle($request->get('title'));
        $note->setContent($request->get('content'));

        $entityManager->persist($note);
        $entityManager->flush();

        return $this->json($this->noteSerializer->serialize($note), Response::HTTP_OK);
    }

    /**
     * @Route("note/{note}", name="api_delete_note", methods={"DELETE"})
     */
    public function delete(Note $note): Response
    {
        $this->denyAccessUnlessGranted('edit', $note);

        $entityManager = $this->getDoctrine()->getManager();
        $entityManager->remove($note);
        $entityManager->flush();

        return $this->json($this->noteSerializer->serialize($note), Response::HTTP_OK);
    }
}
